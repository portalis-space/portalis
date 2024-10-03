import { Module } from '@nestjs/common';
import { TelebotsService } from './services/telebots.service';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TelebotsService],
  exports: [TelebotsService],
})
export class TelebotsModule {}
