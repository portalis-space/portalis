import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stream } from 'stream';
import * as PinataClient from '@pinata/sdk';

@Injectable()
export class IpfsService implements OnModuleInit {
  private pinata: PinataClient;
  private readonly PINATA_KEY = this.config.get<string>('PINATA_KEY');
  private readonly PINATA_SECRET = this.config.get<string>('PINATA_SECRET');
  private readonly logger = new Logger(IpfsService.name);
  constructor(private readonly config: ConfigService) {}
  onModuleInit() {
    this.pinata = new PinataClient(this.PINATA_KEY, this.PINATA_SECRET);
  }

  async ipfsFileUpload(file: Stream, name: string, meta?: Record<string, any>) {
    return this.pinata.pinFileToIPFS(file, {
      pinataMetadata: { name, ...meta },
      pinataOptions: { cidVersion: 0 },
    });
  }
  // async ipfsMetadata(metaData: IPoaMetadata, name: string) {
  //   const data = {
  //     pinataContent: metaData,
  //     pinataMetadata: {
  //       name: `${name} Metadata`,
  //     },
  //   };
  //   const options: AxiosRequestConfig = {
  //     method: 'POST',
  //     url: this.PINATA_BASE_URL + this.PINATA_METADATA_PATH,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${this.PINATA_JWT}`,
  //     },
  //     data,
  //   };
  //   try {
  //     const response = await lastValueFrom(
  //       this.http.request<IPinataMetadataResponse>(options),
  //     );
  //     // console.log(response.data);
  //     return response.data;
  //   } catch (error) {
  //     this.LOGGER.error('Error making metadata on IPFS');
  //     // console.log(error);
  //     throw new UnprocessableEntityException(
  //       'Error on making metadata on IPFS',
  //     );
  //   }
  // }
}
