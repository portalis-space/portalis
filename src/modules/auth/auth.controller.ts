import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from '@utils/interceptors';
import { GetCurrentUser, Public } from '../common/decorators';
import { AuthTokenViewModel } from './vms';
import { circularToJSON, transformer } from '@utils/helpers';
import { AuthDto } from './dto/auth.dto';
import { AtGuard } from 'modules/common/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuth } from './interface/auth.interface';
import mongoose from 'mongoose';
import { UserVms } from 'modules/users/vms/users.vms';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor() {}

  // @UseInterceptors(new ResponseInterceptor('auth'))
  // @Public()
  // @Post('signin')
  // @HttpCode(HttpStatus.OK)
  // async scannerSignin(@Body() dto: AuthDto): Promise<AuthTokenViewModel> {
  //   return this.authService.signin(dto);
  // }

  @UseInterceptors(new ResponseInterceptor('auth'))
  @ApiBearerAuth()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@GetCurrentUser() user: IAuth) {
    return transformer(UserVms, circularToJSON(user));
  }

  // @UseInterceptors(new ResponseInterceptor('auth'))
  // @ApiBearerAuth()
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // async refreshToken(@GetCurrentUser('_id') userId: string) {
  //   this.logger.debug(userId);
  //   return this.authService.refreshToken(userId);
  // }
}
