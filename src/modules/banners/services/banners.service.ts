import { Banner } from '@config/dbs/banner.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ActivationManagerDto,
  CreateBannersDto,
  ListBannerDto,
  UpdateBannersDto,
} from '../dtos/banners.dto';
import { basePagination } from '@utils/base-class/base.paginate';
import { circularToJSON, transformer } from '@utils/helpers';
import { BannerVms } from '../vms/banners.vms';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<Banner>,
  ) {}

  async listBanner(dto: ListBannerDto) {
    const { page, size, status } = dto;
    const pagination = new basePagination(page, size);
    const [banners, count] = await Promise.all([
      this.bannerModel
        .find({ ...(status && { status }) })
        .sort({ status: 'asc' })
        .skip(+pagination.getPage())
        .limit(+pagination.getSize()),
      this.bannerModel.find(),
    ]);

    return { count, rows: transformer(BannerVms, circularToJSON(banners)) };
  }

  async createBanner(dto: CreateBannersDto) {
    const newBanner = new this.bannerModel(dto);
    const banner = await newBanner.save({ validateBeforeSave: true });
    return transformer(BaseViewmodel, circularToJSON(banner));
  }

  async detailBanner(id: string) {
    const banner = await this.bannerModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    return transformer(BannerVms, circularToJSON(banner));
  }

  async updateBanner(id: string, dto: UpdateBannersDto) {
    const banner = await this.bannerModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      dto,
      { runValidators: true, returnDocument: 'after' },
    );
    return transformer(BaseViewmodel, circularToJSON(banner));
  }

  async deleteBanner(id: string) {
    const banner = await this.bannerModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    return transformer(BaseViewmodel, circularToJSON(banner));
  }
}
