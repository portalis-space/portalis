import { UserLog } from '@config/dbs/user-log.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemLogDto, UserLoggerDto } from './loggers.dto';
import { SystemLog } from '@config/dbs/system-log.model';
import { log } from 'console';

@Injectable()
export class LoggersService {
  private logger = new Logger(LoggersService.name);
  constructor(
    @InjectModel(UserLog.name) private readonly userLogModel: Model<UserLog>,
    @InjectModel(SystemLog.name)
    private readonly systemLogModel: Model<SystemLog>,
  ) {}

  async userLog(data: UserLoggerDto) {
    try {
      const log = new this.userLogModel(data);
      await log.save();
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async systemLog(data: SystemLogDto) {
    try {
      const sysLog = new this.systemLogModel(data);
      await sysLog.save();
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
