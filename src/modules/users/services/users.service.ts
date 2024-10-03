import { User } from '@config/dbs/user.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/user.dto';
import { circularToJSON } from '@utils/helpers';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async createUser(dto: CreateUserDto) {
    const { userId, username } = dto;
    const user = await this.user.findOneAndUpdate({ userId, username }, dto, {
      upsert: true,
      returnDocument: 'after',
    });
    // this.logger.debug(user);
    return circularToJSON(user);
  }
}
