import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenViewModel } from './vms';
import { circularToJSON, transformer } from '@utils/helpers';
import { RedisService } from '../../utils/redis/redis.service';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '@config/dbs/user.model';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly encryptor: MetaEncryptorService,
    private readonly redisService: RedisService,
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async signin(dto: AuthDto): Promise<AuthTokenViewModel> {
    const id = this.encryptor.decrypt(dto.token);
    const user = await this.user.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    const response = await this.tokenGenerator(user._id.toString());
    return transformer(AuthTokenViewModel, circularToJSON(response));
  }

  private async tokenGenerator(id: string): Promise<AuthTokenViewModel> {
    const encId = this.encryptor.encrypt(id);
    const [jwt, refresh] = await Promise.all([
      this.jwtService.signAsync(
        { sub: encId },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: this.config.get<string>('AT_EXPIRE'),
        },
      ),
      this.jwtService.signAsync(
        { sub: encId },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: this.config.get<string>('RT_EXPIRE'),
        },
      ),
    ]);
    return {
      accessToken: {
        token: jwt,
        expireIn: this.config.get<string>('AT_EXPIRE'),
      },
      refreshToken: {
        token: refresh,
        expireIn: this.config.get<string>('RT_EXPIRE'),
      },
      tokenType: 'Bearer',
    };
  }

  async localTokenCheck(token: string): Promise<string> {
    try {
      const decData = await this.jwtService.verify(token, {
        secret: this.config.get<string>('AT_SECRET'),
      });
      const decodedId = this.encryptor.decrypt(decData.sub);
      return decodedId;
    } catch (error) {
      return null;
    }
  }

  async validateToken(token: string) {
    const userId = await this.localTokenCheck(token);
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.user.findById(userId);

    return user;
  }

  async refreshToken(userId: string) {
    const response = await this.tokenGenerator(userId);

    return transformer(AuthTokenViewModel, circularToJSON(response));
  }
}
