import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { IpfsService } from '@utils/ipfs/ipfs.service';
import { circularToJSON, transformer } from '@utils/helpers';
import { UploaderVms } from '../vms/uploader.vms';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger(UploaderService.name);
  constructor(private readonly ipfs: IpfsService) {}

  async uploadFile(file: Express.Multer.File) {
    const { buffer, ...trimedDto } = file;
    const stream = Readable.from(buffer);
    const ipfsFile = await this.ipfs.ipfsFileUpload(
      stream,
      trimedDto.originalname,
    );
    return transformer(UploaderVms, circularToJSON(ipfsFile));
  }
}
