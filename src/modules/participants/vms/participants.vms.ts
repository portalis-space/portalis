import { Participant } from '@config/dbs/participant.model';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { Expose, Type } from 'class-transformer';
import { EventsVms } from 'modules/events/vms/events.vms';
import { ScheduleVms } from 'modules/schedules/vms/schedules.vms';
import { TicketVms } from 'modules/tickets/vms/tickets.vms';
import { UserVms } from 'modules/users/vms/users.vms';

export class ParticipantVms extends BaseViewmodel implements Participant {
  @Expose()
  @Type(() => EventsVms)
  event: string;

  @Expose()
  @Type(() => ScheduleVms)
  schedule: string;

  @Expose()
  @Type(() => TicketVms)
  ticket: string;

  @Expose()
  @Type(() => UserVms)
  user: string;
}
