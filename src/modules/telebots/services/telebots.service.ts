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
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {}

  onModuleInit() {
    const telegramBot = require('node-telegram-bot-api');
    const telebots = new telegramBot(this.TELE_BOT, { polling: true });
    // telebots.on('message', msg => {
    //   let Hi = 'hi';
    //   this.logger.debug(msg);
    //   if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    //     telebots.sendMessage(
    //       msg.from.id,
    //       'Hello ' +
    //         msg.from.first_name +
    //         ' what would you like to know about me ?',
    //     );
    //   }
    // });
    telebots.onText(/\/start/, async msg => {
      // this.logger.debug(msg);
      const profPic = await telebots.getUserProfilePhotos(msg.from.id);
      const firstPhotos = (profPic.photos[0] as ITeleUserProfPic[]) || [];
      // this.logger.debug(firstPhotos);
      const photoSet =
        firstPhotos?.length > 0 &&
        (await Promise.all(
          firstPhotos.map(async photo => {
            const file = (await telebots.getFile(
              photo.file_id,
            )) as ITeleUserProfPicFile;
            const response: CreateUserProfilePicDto = {
              fileId: photo.file_id,
              filePath: file.file_path,
              fileSize: photo.file_size,
              fileUniqueId: photo.file_unique_id,
              height: photo.height,
              width: photo.width,
            };
            return response;
          }),
        ));
      const userDto: CreateUserDto = {
        chatId: msg.chat.id,
        userId: msg.from.id,
        username: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        profilePics: photoSet || [],
      };
      // this.logger.debug(userDto);
      const user = await this.userService.createUser(userDto);
      // this.logger.debug(user.id);
      telebots.sendMessage(msg.chat.id, 'Welcome', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                web_app: { url: this.FE_LOGIN_URL + `?token=${user.id}` },
                text: 'PORTALIS',
              },
            ],
          ],
        },
      });
    });
  }
}
