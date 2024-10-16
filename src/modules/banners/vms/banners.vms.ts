import { Banner } from '@config/dbs/banner.model';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { StatusEnum } from '@utils/enums';
import { Expose } from 'class-transformer';

export class BannerVms extends BaseViewmodel implements Banner {
  @Expose()
  index: number;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  image: string;
  @Expose()
  status: StatusEnum;
}
