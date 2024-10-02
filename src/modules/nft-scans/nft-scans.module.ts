import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NftScanEvmService } from './services/nft-scan-evm.service';
import { NftScanTonService } from './services/nft-scan-ton.service';

@Module({
  imports: [HttpModule],
  providers: [NftScanEvmService, NftScanTonService],
  exports: [NftScanEvmService, NftScanTonService],
})
export class NftScansModule {}
