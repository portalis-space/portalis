import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isValid, parse } from '@telegram-apps/init-data-node';
import { UsersService } from 'modules/users/services/users.service';
import { TelebotsService } from 'modules/telebots/services/telebots.service';
import { JwtService } from '@nestjs/jwt';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { transformer, circularToJSON } from '@utils/helpers';
import mongoose from 'mongoose';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { AuthTokenViewModel } from './vms';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private TELE_BOT = this.config.get<string>('TELE_BOT');
  private ADM_USER = this.config.get<string>('ADMIN_USER');
  private ADM_PASSWORD = this.config.get<string>('ADMIN_PASSWORD');
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
    private readonly telebot: TelebotsService,
    private readonly jwtService: JwtService,
    private readonly encryptor: MetaEncryptorService,
  ) {}

  async signinAdmin(dto: AuthDto): Promise<AuthTokenViewModel> {
    const { password, username } = dto;
    const passHash = await argon.hash(this.ADM_PASSWORD);
    if (username != this.ADM_USER)
      throw new UnprocessableEntityException('Invalid User');
    if (!argon.verify(passHash, password))
      throw new UnprocessableEntityException('Invalid Password');
    const response = await this.tokenGenerator(this.ADM_USER);
    return transformer(AuthTokenViewModel, circularToJSON(response));
  }

  async localTokenCheck(token: string): Promise<string> {
    try {
      const decData = await this.jwtService.verify(token, {
        secret: this.config.get<string>('AT_SECRET'),
      });
      const decodedId = this.encryptor.decrypt(decData.sub);
      if (decodedId != this.ADM_USER)
        throw new UnauthorizedException('Invalid Account');
      return decodedId;
    } catch (error) {
      return null;
    }
  }

  async validateAdminToken(token: string) {
    const userId = await this.localTokenCheck(token);
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }

  // async refreshToken(userId: string) {
  //   const response = await this.tokenGenerator(userId);

  //   return transformer(AuthTokenViewModel, circularToJSON(response));
  // }
  // not used =========================================

  async validateTelegramToken(token: string) {
    const parsedToken = parse(token);
    // if (!isValid(token, this.TELE_BOT)) {
    //   throw new UnauthorizedException();
    // }
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

  private async tokenGenerator(id: string): Promise<AuthTokenViewModel> {
    const encId = this.encryptor.encrypt(id);
    const jwt = await this.jwtService.signAsync(
      { sub: encId },
      {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: this.config.get<string>('AT_EXPIRE'),
      },
    );
    return {
      accessToken: {
        token: jwt,
        expireIn: this.config.get<string>('AT_EXPIRE'),
      },
      tokenType: 'Bearer',
    };
  }

  // async validateAdminToken(token: string) {}
}
