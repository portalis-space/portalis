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
import { Event } from '@config/dbs/event.model';
import { Schedule } from '@config/dbs/schedule.model';
import { ChainsTypeEnum, StatusEnum } from '@utils/enums';
import { NftScanEvmService } from 'modules/nft-scans/services/nft-scan-evm.service';
import { NftScanTonService } from 'modules/nft-scans/services/nft-scan-ton.service';
import { EvmChain } from 'nftscan-api';
import { circularToJSON, transformer } from '@utils/helpers';
import { basePagination } from '@utils/base-class/base.paginate';
import { TicketVms } from '../vms/tickets.vms';
import { add, getUnixTime } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { User } from '@config/dbs/user.model';
import { Participant } from '@config/dbs/participant.model';
import { ValidityCheckTypeEnum } from '@utils/enums/validity.enum';
import { INftOwnerAmount } from 'modules/nft-scans/interfaces/nft-scans.interface';

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
    const validityCheck = await this.validiyCheck(
      dto,
      userId,
      ValidityCheckTypeEnum.GENERATE_TICKET,
    );
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
      { $skip: +pagination.getPage() },
      { $limit: +pagination.getSize() },
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
      { path: 'scannedBy' },
    ]);
    return {
      count: count.length,
      rows: transformer(TicketVms, circularToJSON(populatedTickets)),
    };
  }

  async detailTicket(id: string) {
    const ticket = await this.ticketModel
      .findOne({
        _id: new mongoose.Types.ObjectId(id),
      })
      .populate([
        { path: 'event', populate: { path: 'schedules' } },
        { path: 'owner' },
        { path: 'scannedBy' },
      ]);
    return transformer(TicketVms, circularToJSON(ticket));
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
      ValidityCheckTypeEnum.GENERATE_TICKET_QR,
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
      throw new UnprocessableEntityException(`Ticket QR already expired`);
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
    if (ticketData.status != TicketStatusEnum.AVAILABLE)
      throw new UnprocessableEntityException(
        'Ticket cant be used, invalid ticket or ticket already used',
      );
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
      ValidityCheckTypeEnum.SCAN_TICKET_QR,
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
    validityCheckType: ValidityCheckTypeEnum,
    scannerUser?: string,
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
        // owner: new mongoose.Types.ObjectId(userId),
        status: [TicketStatusEnum.AVAILABLE, TicketStatusEnum.USED],
      }),
      this.eventModel.findOne({ _id: new mongoose.Types.ObjectId(event) }),
    ]);
    if (!eventData) {
      response.message = 'Invalid Event';
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
      {
        path: 'owner',
        // match: { contract_address: contractAddress },
      },
    ]);
    // this.logger.debug(eventData.owner);
    if (
      validityCheckType == ValidityCheckTypeEnum.SCAN_TICKET_QR &&
      !eventData.scanners.includes(scannerUser) &&
      (eventData.owner as unknown as User).username == scannerUser
    ) {
      // this.logger.debug(eventData.scanners, scannerUser);
      response.message = 'Invalid Scanner';
      return response;
    }
    response.event = populatedEvent;
    // this.logger.debug({ populatedEvent });
    if (
      validityCheckType != ValidityCheckTypeEnum.GENERATE_TICKET &&
      populatedEvent.schedules.length < 1
    ) {
      response.message = 'Invalid Event Schedule';
      return response;
    }
    response.activeSchedule = (
      populatedEvent.schedules as unknown as Schedule[]
    ).find(
      sched =>
        sched.status == StatusEnum.ACTIVE &&
        sched.startAt <= now &&
        sched.endAt >= now,
    );
    // this.logger.debug(populatedEvent.schedules);
    // this.logger.debug(response.activeSchedule);
    if (populatedEvent.contractAddresses.length < 1) {
      response.message = 'Invalid Contract Address';
      return response;
    }
    // validate event capacity
    // if(){}
    if (type == ChainsTypeEnum.EVM) {
      const nftOwner = await this.nftOwnerCheck(
        chain as unknown as EvmChain,
        contractAddress,
        token.toString(),
        walletAddress,
        100,
      );
      // testing log
      // this.logger.debug({ nftOwner });
      if (!nftOwner) {
        response.message = 'Invalid Nft';
        return response;
      }
      if (
        validityCheckType == ValidityCheckTypeEnum.GENERATE_TICKET &&
        tickets >= +nftOwner.amount
      ) {
        response.message = 'Nft Already Used';
        return response;
      }
    }
    if (type == ChainsTypeEnum.TON) {
      const nft = await this.nftScanTonService.getSingleNft(token);
      if (
        !nft ||
        nft.owner?.toLowerCase() != walletAddress?.toLowerCase() ||
        (validityCheckType == ValidityCheckTypeEnum.GENERATE_TICKET &&
          tickets) > 0
      ) {
        response.message = 'Invalid Nft';
        return response;
      }
    }
    response.valid = true;
    response.message = 'Valid Request';
    return response;
  }

  private async nftOwnerCheck(
    chain: EvmChain,
    contract: string,
    tokenId: string,
    walletAddress: string,
    limit?: number,
    cursor?: string,
  ) {
    let owner;
    const nftOwnersResponse = await this.nftScanEvmService.getNftOwner(
      chain,
      contract,
      tokenId,
      limit,
      cursor,
    );
    owner = nftOwnersResponse.content.find(
      data => data.account_address.toLowerCase() == walletAddress.toLowerCase(),
    );

    if (!owner) {
      owner = await this.nftOwnerCheck(
        chain,
        contract,
        tokenId,
        walletAddress,
        limit,
        nftOwnersResponse.next,
      );
    }
    return owner as INftOwnerAmount;
  }
}
