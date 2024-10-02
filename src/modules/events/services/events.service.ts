import { Event, EventDocument } from '@config/dbs/event.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, RootFilterQuery } from 'mongoose';
import {
  CreateEventDto,
  EventListDto,
  UpdateEventDto,
} from '../dtos/events.dto';
import { circularToJSON, transformer } from '@utils/helpers';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { basePagination } from '@utils/base-class/base.paginate';
import { EventsVms } from '../vms/events.vms';
import { SortToNumberEnum } from '@utils/enums/sort.enum';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { SchedulesService } from 'modules/schedules/services/schedules.service';
import { CollectionsService } from 'modules/collections/services/collections.service';
import { Collection } from '@config/dbs/collection.model';
import { ChainsTypeEnum } from '@utils/enums';
import { NftScanEvmService } from 'modules/nft-scans/services/nft-scan-evm.service';
import { NftScanTonService } from 'modules/nft-scans/services/nft-scan-ton.service';
import { EvmChain } from 'nftscan-api';
import { CollectionAssets } from 'nftscan-api/dist/src/types/evm';
import { INftScanTonCollectionNft } from 'modules/nft-scans/interfaces/nft-scans.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EventsService {
  private logger = new Logger(EventsService.name);
  constructor(
    @InjectModel(Event.name) private readonly event: Model<Event>,
    private readonly scheduleService: SchedulesService,
    private readonly collectionService: CollectionsService,
    @InjectModel(Collection.name)
    private readonly collection: Model<Collection>,
    @InjectQueue('event') private readonly eventQue: Queue,
    private readonly encriptor: MetaEncryptorService,
    private readonly nftTonService: NftScanTonService,
    private readonly nftEvmService: NftScanEvmService,
  ) {}

  async create(dto: CreateEventDto, userId: string, username: string) {
    const generateEventId = new mongoose.Types.ObjectId();
    const scheduleIds = (await this.scheduleService.generateSchedules(
      dto.scheduleType,
      dto.startDate,
      dto.endDate,
      dto.startTime,
      dto.endTime,
      dto.timezone,
      dto.scheduleInterval,
      generateEventId.toString(),
    )) as string[];
    const constructedDto = await this.transactionBuilder(
      { ...dto, scheduleIds },
      username,
      userId,
    );
    const newEvent = new this.event({
      _id: generateEventId,
      ...constructedDto,
    });
    const event = await newEvent.save({ validateBeforeSave: true });
    this.eventSceduler(event);
    return transformer(BaseViewmodel, circularToJSON(event));
  }

  async list(dto: EventListDto, username: string) {
    const {
      latitude,
      longitude,
      distanceRad,
      page,
      size,
      wallet,
      status,
      search,
      isHighlighted,
      eligibleEvent,
      owner,
      sort,
      chain,
      type,
      scannerEvent,
    } = dto;
    const contractAddress: mongoose.Types.ObjectId[] = [];
    if (eligibleEvent) {
      if (type == ChainsTypeEnum.EVM) {
        const { count, rows } =
          await this.nftEvmService.getAllPaginatedNFtsByWallet(
            chain as EvmChain,
            wallet,
          );
        await Promise.all(
          (rows as CollectionAssets[]).map(async row => {
            const collection = await this.collection.findOne({
              contract_address: row.contract_address,
            });
            contractAddress.push(collection._id);
          }),
        );
      } else {
        const { count, rows } =
          await this.nftTonService.getAllPaginatedNfts(wallet);
        await Promise.all(
          (rows as INftScanTonCollectionNft[]).map(async row => {
            const collection = await this.collection.findOne({
              contract_address: row.contract_address,
            });
            contractAddress.push(collection._id);
          }),
        );
      }
    }
    // this.logger.debug(owner, this.encriptor.decrypt(owner));
    const pagination = new basePagination(page, size);
    // this.logger.debug(owner);
    let whereQ: RootFilterQuery<Event> = {
      ...(isHighlighted && { isHighlighted }),
      deletedAt: null,
      ...(owner && {
        owner: new mongoose.Types.ObjectId(this.encriptor.decrypt(owner)),
      }),
      ...(contractAddress.length > 0 && { contractAddresses: contractAddress }),
      ...(status && { status }),
      ...(scannerEvent && { scanners: [username] }),
    };

    // this.logger.debug(whereQ);
    // if (eligibleEvent) {
    //   const eligibleCollection;
    //   const collections = await this.collection.find({ contract_address: [] });
    // }
    const geoQ: PipelineStage.GeoNear = latitude &&
      longitude &&
      distanceRad && {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'dist.calculated',
          maxDistance: +distanceRad,
          includeLocs: 'dist.location',
          spherical: true,
        },
      };
    const aggregateQ: PipelineStage[] = [];
    const paginationQ: PipelineStage[] = [
      { $limit: +pagination.getSize() },
      { $skip: +pagination.getPage() },
    ];
    if (geoQ) aggregateQ.push(geoQ);
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
    if (sort)
      aggregateQ.push({
        $sort: {
          ...(sort.title && { title: SortToNumberEnum[sort.title] }),
          ...(sort.capacity && { capacity: SortToNumberEnum[sort.capacity] }),
          ...(sort.schedule && { startAt: SortToNumberEnum[sort.schedule] }),
        },
      });
    const [events, count] = await Promise.all([
      this.event.aggregate(aggregateQ.concat(paginationQ)),
      this.event.aggregate(aggregateQ),
    ]);
    const populatedEvents = await this.event.populate(events, [
      {
        path: 'owner',
      },
      { path: 'schedules' },
      { path: 'contractAddresses' },
    ]);
    return {
      count: count.length,
      rows: transformer(EventsVms, circularToJSON(populatedEvents)),
    };
  }

  async detail(id: string) {
    const event = await this.event
      .findById(id)
      .populate('owner')
      .populate('schedules')
      .populate('contractAddresses');
    return transformer(EventsVms, circularToJSON(event), {
      groups: ['DETAIL'],
    });
  }

  async update(id: string, dto: UpdateEventDto, owner: string) {
    const constructedDto = await this.transactionBuilder(dto);
    const event = await this.event.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(owner),
      },
      constructedDto,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    return transformer(BaseViewmodel, circularToJSON(event));
  }

  async destroy(id: string, owner: string) {
    const event = await this.event.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(owner),
      },
      { deletedAt: new Date() },
    );
    return transformer(BaseViewmodel, circularToJSON(event));
  }

  private async transactionBuilder(
    dto: UpdateEventDto,
    username?: string,
    userId?: string,
  ) {
    const {
      endDate,
      startDate,
      startTime,
      endTime,
      timezone,
      location,
      scheduleIds,
      contractAddresses,
      scanners,
      ...trimedDto
    } = dto;

    let eventScanners = [username];
    if (scanners && !scanners.includes(username)) {
      eventScanners = eventScanners.concat(scanners);
    }
    const { utcEndAt, utcStartAt } = this.scheduleService.utcGenerator(
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
    );
    const collections =
      contractAddresses &&
      contractAddresses.length > 0 &&
      (await Promise.all(
        contractAddresses.map(async contract => {
          const col = await this.collectionService.checkCollection(contract);
          return col.id;
        }),
      ));
    const constructedDto = {
      ...trimedDto,
      owner: userId,
      ...(timezone && { timezone }),
      ...(collections &&
        collections.length > 0 && { contractAddresses: collections }),
      ...(location && {
        location: {
          ...(location.address && { address: location.address }),
          ...(location.latitude &&
            location.longitude && {
              coordinates: [location.longitude, location.latitude],
            }),
        },
      }),
      ...(utcStartAt && { startAt: utcStartAt }),
      ...(utcEndAt && { endAt: utcEndAt }),
      ...(scheduleIds && { schedules: scheduleIds }),
      scanners: eventScanners,
    };

    return constructedDto;
  }

  private eventSceduler(event: EventDocument) {
    const now = new Date();
    const [startDelay, endDelay] = [
      Number(event.startAt) - Number(now),
      Number(event.endAt) - Number(now),
    ];

    this.eventQue.add(
      'activate',
      { id: event._id },
      {
        ...(startDelay > 0 && { delay: startDelay }),
        jobId: event._id.toString(),
      },
    );
    this.eventQue.add(
      'deactivate',
      { id: event._id },
      { ...(endDelay > 0 && { delay: endDelay }), jobId: event._id.toString() },
    );
  }
}
