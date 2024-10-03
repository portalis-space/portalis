import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isValid, parse } from '@telegram-apps/init-data-node';
import { UsersService } from 'modules/users/services/users.service';
import { TelebotsService } from 'modules/telebots/services/telebots.service';

@Injectable()
export class AuthService {
  private TELE_BOT = this.config.get<string>('TELE_BOT');
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
    private readonly telebot: TelebotsService,
  ) {}
  // not used ==========================================
  // async signin(dto: AuthDto): Promise<AuthTokenViewModel> {
  //   const id = this.encryptor.decrypt(dto.token);
  //   const user = await this.user.findOne({
  //     _id: new mongoose.Types.ObjectId(id),
  //   });
  //   const response = await this.tokenGenerator(user._id.toString());
  //   return transformer(AuthTokenViewModel, circularToJSON(response));
  // }

  // private async tokenGenerator(id: string): Promise<AuthTokenViewModel> {
  //   const encId = this.encryptor.encrypt(id);
  //   const [jwt, refresh] = await Promise.all([
  //     this.jwtService.signAsync(
  //       { sub: encId },
  //       {
  //         secret: this.config.get<string>('AT_SECRET'),
  //         expiresIn: this.config.get<string>('AT_EXPIRE'),
  //       },
  //     ),
  //     this.jwtService.signAsync(
  //       { sub: encId },
  //       {
  //         secret: this.config.get<string>('AT_SECRET'),
  //         expiresIn: this.config.get<string>('RT_EXPIRE'),
  //       },
  //     ),
  //   ]);
  //   return {
  //     accessToken: {
  //       token: jwt,
  //       expireIn: this.config.get<string>('AT_EXPIRE'),
  //     },
  //     refreshToken: {
  //       token: refresh,
  //       expireIn: this.config.get<string>('RT_EXPIRE'),
  //     },
  //     tokenType: 'Bearer',
  //   };
  // }

  // async localTokenCheck(token: string): Promise<string> {
  //   try {
  //     const decData = await this.jwtService.verify(token, {
  //       secret: this.config.get<string>('AT_SECRET'),
  //     });
  //     const decodedId = this.encryptor.decrypt(decData.sub);
  //     return decodedId;
  //   } catch (error) {
  //     return null;
  //   }
  // }

  // async validateToken(token: string) {
  //   const userId = await this.localTokenCheck(token);
  //   if (!userId) {
  //     throw new UnauthorizedException();
  //   }

  //   const user = await this.user.findById(userId);

  //   return user;
  // }

  // async refreshToken(userId: string) {
  //   const response = await this.tokenGenerator(userId);

  //   return transformer(AuthTokenViewModel, circularToJSON(response));
  // }
  // not used =========================================

  async validateTelegramToken(token: string) {
    const parsedToken = parse(token);
    // this.logger.debug(token);
    if (!isValid(token, this.TELE_BOT)) {
      throw new UnauthorizedException();
    }
    const userPhoto = await this.telebot.getUserPhoto(
      parsedToken.user.id.toString(),
    );
    const user = await this.userService.createUser({
      firstName: parsedToken.user.firstName,
      lastName: parsedToken.user.lastName,
      username: parsedToken.user.username,
      chatId: parsedToken.chat?.id.toString(),
      userId: parsedToken.user.id.toString(),
      profilePics: userPhoto,
    });
    // this.logger.debug({ user });

    return user;
  }
}
