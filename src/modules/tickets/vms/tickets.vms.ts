import { Participant } from '@config/dbs/participant.model';
import { Ticket } from '@config/dbs/ticket.model';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { ChainsEnum, ChainsTypeEnum } from '@utils/enums';
import { TicketStatusEnum } from '@utils/enums/ticket.enum';
import { Expose, Type } from 'class-transformer';
import { EventsVms } from 'modules/events/vms/events.vms';
import { UserVms } from 'modules/users/vms/users.vms';
import { EvmChain } from 'nftscan-api';

export class TicketVms {
  @Expose()
  chain: string;
  @Expose()
  contractAddress: string;
  @Expose()
  @Type(() => EventsVms)
  event: EventsVms;
  @Expose()
  expiredAt: Date;
  @Expose()
  issuedAt: Date;
  @Expose()
  @Type(() => UserVms)
  owner: UserVms;
  @Expose()
  status?: string;
  @Expose()
  ticketNumber: string;
  @Expose()
  token: string;
  @Expose()
  type: string;
  @Expose()
  walletAddress: string;
  @Expose()
  @Type(() => UserVms)
  scannedBy?: UserVms;
}
