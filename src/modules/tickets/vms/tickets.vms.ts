import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { Expose, Type } from 'class-transformer';
import { EventsVms } from 'modules/events/vms/events.vms';
import { UserVms } from 'modules/users/vms/users.vms';

export class TicketVms extends BaseViewmodel {
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
