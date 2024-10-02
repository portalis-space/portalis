import { Module } from '@nestjs/common';
import { NftScansModule } from 'modules/nft-scans/nft-scans.module';
import { NftsService } from './services/nfts.service';
import { NftsController } from './controllers/nfts.controller';

@Module({
  imports: [NftScansModule],
  providers: [NftsService],
  controllers: [NftsController],
})
export class NftsModule {}
