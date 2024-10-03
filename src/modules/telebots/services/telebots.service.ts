import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'modules/users/services/users.service';
import {
  ITeleUserProfPic,
  ITeleUserProfPicFile,
} from '../interfaces/telebots.interface';
import { User } from '@config/dbs/user.model';
import { ProfilePicture } from '@config/dbs/profile-picture.model';
import {
  CreateUserDto,
  CreateUserProfilePicDto,
} from 'modules/users/dtos/user.dto';

@Injectable()
export class TelebotsService implements OnModuleInit {
  private logger = new Logger(TelebotsService.name);
  private FE_LOGIN_URL = this.config.get<string>('FE_LOGIN_URL');
  private TELE_BOT = this.config.get<string>('TELE_BOT');
  private teleBots: any;
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {}

  onModuleInit() {
    const telegramBot = require('node-telegram-bot-api');
    const telebots = new telegramBot(this.TELE_BOT, { polling: true });
    this.teleBots = telebots;
    telebots.onText(/\/start/, async msg => {
      // this.logger.debug(msg);
      const photo = await this.getUserPhoto(msg.from.id);
      const userDto: CreateUserDto = {
        chatId: msg.chat.id,
        userId: msg.from.id,
        username: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        profilePics: photo,
      };
      // this.logger.debug(userDto);
      const user = await this.userService.createUser(userDto);
      this.logger.debug(user._id);
      telebots.sendMessage(msg.chat.id, 'Welcome', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                web_app: { url: this.FE_LOGIN_URL },
                text: 'PORTALIS',
              },
            ],
          ],
        },
      });
    });
  }

  async getUserPhoto(id: string) {
    const profPic = await this.teleBots.getUserProfilePhotos(+id);

    const firstPhotos = (profPic.photos[0] as ITeleUserProfPic[]) || [];
    // this.logger.debug(firstPhotos);
    let photo: string;
    if (firstPhotos.length > 1) {
      const file = (await this.teleBots.getFile(
        firstPhotos[0].file_id,
      )) as ITeleUserProfPicFile;
      this.logger.debug(file);
      photo = `${process.env.TELE_API_URL}${process.env.TELE_BOT}/${file.file_path}`;
    }
    return photo;
  }
}
