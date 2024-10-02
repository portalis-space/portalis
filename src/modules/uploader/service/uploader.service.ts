import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { IpfsService } from '@utils/ipfs/ipfs.service';
import { circularToJSON, transformer } from '@utils/helpers';
import { UploaderVms } from '../vms/uploader.vms';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger(UploaderService.name);
  constructor(private readonly ipfs: IpfsService) {}

  async uploadFile({ originalname, buffer, mimetype }: Express.Multer.File) {
    const stream = Readable.from(buffer);
    const ipfsFile = await this.ipfs.ipfsFileUpload(stream, originalname);
    return transformer(UploaderVms, circularToJSON(ipfsFile));
  }
}
