import { Ticket } from '@config/dbs/ticket.model';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, RootFilterQuery } from 'mongoose';
import {
  CreateTicketDto,
  CreateTicketQrDto,
  ListTicketDto,
  ScanTicketQrDto,
} from '../dtos/tickets.dto';
import { TicketStatusEnum } from '@utils/enums/ticket.enum';
import { Collection, EvmCollection } from '@config/dbs/collection.model';
import { Event } from '@config/dbs/event.model';
import { Schedule } from '@config/dbs/schedule.model';
import { ChainsTypeEnum, StatusEnum } from '@utils/enums';
import { NftScanEvmService } from 'modules/nft-scans/services/nft-scan-evm.service';
import { NftScanTonService } from 'modules/nft-scans/services/nft-scan-ton.service';
import { ErcType, EvmChain } from 'nftscan-api';
import { circularToJSON, transformer } from '@utils/helpers';
import { basePagination } from '@utils/base-class/base.paginate';
import { TicketVms } from '../vms/tickets.vms';
import { chains } from 'modules/chains/types/chains.type';
import { add, getUnixTime } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { User } from '@config/dbs/user.model';
import { Participant } from '@config/dbs/participant.model';

@Injectable()
export class TicketsService {
  private logger = new Logger(TicketsService.name);
  private QR_EXPIRE_TIME = this.config.get<string>('QR_EXPIRE_TIME');
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Participant.name)
    private readonly participantModel: Model<Participant>,
    private readonly nftScanEvmService: NftScanEvmService,
    private readonly nftScanTonService: NftScanTonService,
    private readonly config: ConfigService,
    private readonly enc: MetaEncryptorService,
  ) {}

  async createTicket(dto: CreateTicketDto, userId: string) {
    const { contractAddress, event, token, walletAddress, chain, type } = dto;
    const validityCheck = await this.validiyCheck(dto, userId);
    if (!validityCheck.valid)
      throw new UnprocessableEntityException(validityCheck.message);

    const ticketNumber = `PORT-${userId}${validityCheck.checkAt.getTime().toString(36)}`;
    const newTicket = new this.ticketModel({
      chain,
      contractAddress,
      event,
      expiredAt: validityCheck.event.endAt,
      owner: userId,
      token,
      type,
      walletAddress,
      ticketNumber,
    });
    const savedTicket = await newTicket.save();
    return circularToJSON(savedTicket);
  }

  async ticketList(dto: ListTicketDto, userId: string) {
    const { event, page, size, walletAddress, search } = dto;
    const pagination = new basePagination(page, size);
    const aggregateQ: PipelineStage[] = [];
    let whereQ: RootFilterQuery<Ticket> = {
      owner: new mongoose.Types.ObjectId(userId),
      walletAddress,
      ...(event && { event: new mongoose.Types.ObjectId(event) }),
    };
    const paginationQ: PipelineStage[] = [
      { $limit: +pagination.getSize() },
      { $skip: +pagination.getPage() },
    ];
    if (search)
      aggregateQ.push({
        $search: {
          index: 'search',
          text: {
            query: search,
            path: {
              wildcard: '*',
            },
          },
        },
      });
    if (Object.keys(whereQ).length > 0) aggregateQ.push({ $match: whereQ });
    const [tickets, count] = await Promise.all([
      this.ticketModel.aggregate(aggregateQ.concat(paginationQ)),
      this.ticketModel.aggregate(aggregateQ),
    ]);
    const populatedTickets = await this.ticketModel.populate(tickets, [
      { path: 'event', populate: { path: 'schedules' } },
      { path: 'owner' },
    ]);
    return {
      count: count.length,
      rows: transformer(TicketVms, circularToJSON(populatedTickets)),
    };
  }

  async generateQr(dto: CreateTicketQrDto, userId: string) {
    const { ticket, walletAddress } = dto;
    const ticketData = await this.ticketModel.findOne({
      _id: new mongoose.Types.ObjectId(ticket),
      walletAddress,
      owner: new mongoose.Types.ObjectId(userId),
    });
    const validityCheck = await this.validiyCheck(
      {
        chain: ticketData.chain,
        contractAddress: ticketData.contractAddress,
        event: ticketData.event.toString(),
        token: ticketData.token,
        type: ticketData.type,
        walletAddress: ticketData.walletAddress,
      },
      ticketData.owner,
    );
    if (!validityCheck.valid)
      throw new UnprocessableEntityException(validityCheck.message);
    const expiredAt = getUnixTime(
      add(validityCheck.checkAt, {
        seconds: +this.QR_EXPIRE_TIME,
      }),
    );
    if (!validityCheck.activeSchedule)
      throw new UnprocessableEntityException('No event schedule found');
    const qrString = [
      ticketData.ticketNumber,
      ticketData._id.toString(),
      ticketData.owner,
      ticketData.walletAddress,
      expiredAt,
    ].join(':');
    return { qrString: this.enc.encrypt(qrString), expiredAt };
  }

  async scanTicket(dto: ScanTicketQrDto, scannerUser: string) {
    const { qrString } = dto;
    let qrData: string;
    try {
      qrData = this.enc.decrypt(qrString);
    } catch (error) {
      throw new UnprocessableEntityException('Invalid QR Code, QR malformed');
    }
    const [ticketNumber, ticketId, userId, walletAddress, expireAt] =
      qrData.split(':');
    const dateNow = getUnixTime(new Date());
    if (dateNow > +expireAt) {
      throw new UnprocessableEntityException(`Ticket already expired`);
    }
    const ticketData = await this.ticketModel.findOne({
      _id: new mongoose.Types.ObjectId(ticketId),
    });
    if (
      (!ticketData ||
        ticketData.ticketNumber != ticketNumber ||
        ticketData.owner.toString() != userId,
      ticketData.walletAddress != walletAddress)
    ) {
      throw new UnprocessableEntityException('Invalid QR Code, QR malformed');
    }
    const validityCheck = await this.validiyCheck(
      {
        chain: ticketData.chain,
        contractAddress: ticketData.contractAddress,
        event: ticketData.event.toString(),
        token: ticketData.token,
        type: ticketData.type,
        walletAddress: ticketData.walletAddress,
      },
      ticketData.owner,
      scannerUser,
    );
    if (!validityCheck.valid)
      throw new UnprocessableEntityException(validityCheck.message);
    if (!validityCheck.activeSchedule)
      throw new UnprocessableEntityException('No event schedule found');
    const scanner = await this.userModel.findOne({ username: scannerUser });
    const participant = new this.participantModel({
      event: ticketData.event,
      schedule: validityCheck.activeSchedule._id,
      ticket: ticketData._id,
      user: ticketData.owner,
    });
    await Promise.all([
      this.ticketModel.findOneAndUpdate(
        { _id: ticketData._id },
        { status: TicketStatusEnum.USED, scannedBy: scanner._id },
      ),
      participant.save({ validateBeforeSave: true }),
    ]);
  }

  private async validiyCheck(
    dto: CreateTicketDto,
    userId: string,
    scanneUser?: string,
  ) {
    const { contractAddress, event, token, walletAddress, chain, type } = dto;
    const now = new Date();
    let response = {
      valid: false,
      checkAt: now,
      event: null,
      activeSchedule: null,
      message: '',
    };
    const [tickets, eventData] = await Promise.all([
      this.ticketModel.countDocuments({
        walletAddress,
        event: new mongoose.Types.ObjectId(event),
        token,
        contractAddress,
        owner: new mongoose.Types.ObjectId(userId),
        status: [TicketStatusEnum.AVAILABLE, TicketStatusEnum.USED],
      }),
      this.eventModel.findOne({ _id: new mongoose.Types.ObjectId(event) }),
    ]);
    if (!eventData) {
      response.message = 'Invalid Event';
      return response;
    }
    if (scanneUser && eventData.scanners.includes(scanneUser)) {
      response.message = 'Invalid Scanner';
      return response;
    }
    const populatedEvent = await this.eventModel.populate(eventData, [
      {
        path: 'schedules',
        match: { endAt: { $gt: now } },
      },
      {
        path: 'contractAddresses',
        match: { contract_address: contractAddress },
      },
    ]);
    response.event = populatedEvent;
    // this.logger.debug({ populatedEvent });
    if (populatedEvent.schedules.length < 1) {
      response.message = 'Invalid Event Schedule';
      return response;
    }
    response.activeSchedule = (
      populatedEvent.schedules as unknown as Schedule[]
    ).find(
      sched =>
        sched.status == StatusEnum.ACTIVE &&
        sched.startAt >= now &&
        sched.endAt <= now,
    );
    if (populatedEvent.contractAddresses.length < 1) {
      response.message = 'Invalid Contract Address';
      return response;
    }
    if (type == ChainsTypeEnum.EVM) {
      const nft = await this.nftScanEvmService.getNft(
        chain as unknown as EvmChain,
        contractAddress,
        token,
      );
      if (!nft || nft.owner != walletAddress) {
        response.message = 'Invalid Nft';
        return response;
      }
      if (tickets >= +nft.amount) {
        response.message = 'Nft Already Used';
        return response;
      }
    }
    if (type == ChainsTypeEnum.TON) {
      const nft = await this.nftScanTonService.getSingleNft(token);
      if (!nft || nft.owner != walletAddress || tickets > 0) {
        response.message = 'Invalid Nft';
        return response;
      }
    }
    response.valid = true;
    response.message = 'Valid Request';
    return response;
  }
}
