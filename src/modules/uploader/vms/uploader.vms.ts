import { Expose, Transform } from 'class-transformer';

export class UploaderVms {
  @Expose()
  IpfsHash: string;
  @Expose()
  PinSize: number;
  @Expose()
  Timestamp: string;
  @Expose()
  @Transform(({ obj }) => `${process.env.PINATA_GATEWAY_URL}${obj.IpfsHash}`)
  fileUrl: string;
}
