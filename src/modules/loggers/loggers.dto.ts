import { SystemLog } from '@config/dbs/system-log.model';
import { UserLog } from '@config/dbs/user-log.model';
import { ResultStatusEnum } from '@utils/enums/result-status.enum';

export class UserLoggerDto implements UserLog {
  user: string;
  response?: Record<string, any>;
  request?: Record<string, any>;
  requestPath?: string;
  errorConsole?: Record<string, any>;
  result: ResultStatusEnum;
  method?: string;
  requestQuery?: Record<string, any>;
}

export class SystemLogDto implements SystemLog {
  classMethod?: string;
  classService?: string;
  dto?: Record<string, any>;
  result: Record<string, any>;
  status: ResultStatusEnum;
}
