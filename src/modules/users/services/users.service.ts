import { User } from '@config/dbs/user.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/user.dto';
import { circularToJSON, transformer } from '@utils/helpers';
import { UserVms } from '../vms/users.vms';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async createUser(dto: CreateUserDto) {
    const { chatId, userId, username } = dto;
    const user = await this.user.findOneAndUpdate(
      { userId, chatId, username },
      dto,
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    return transformer(UserVms, circularToJSON(user));
  }
}
