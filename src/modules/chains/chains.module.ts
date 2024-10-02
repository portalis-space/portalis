import { Module } from '@nestjs/common';
import { ChainsController } from './controllers/chains.controller';
import { ChainsService } from './services/chains.service';

@Module({ controllers: [ChainsController], providers: [ChainsService] })
export class ChainsModule {}
