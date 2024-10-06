import { ProgressQuest } from '@config/dbs/progress-quest.model';
import { Quest } from '@config/dbs/quest.model';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { circularToJSON, transformer } from '@utils/helpers';
import mongoose, { Model } from 'mongoose';
import { CreateProgressDto } from '../dtos/progress-quests.dto';

@Injectable()
export class ProgressQuestsService {
  private logger = new Logger(ProgressQuestsService.name);
  constructor(
    @InjectModel(ProgressQuest.name)
    private readonly progressModel: Model<ProgressQuest>,
    @InjectModel(Quest.name) private readonly questModel: Model<Quest>,
  ) {}

  async submitProgress(dto: CreateProgressDto, userId: string) {
    const quest = await this.questModel.findById(dto.quest);
    if (dto.queantity != quest.reqAmount)
      throw new UnprocessableEntityException('Invalid Action');
    const currentProgress = await this.progressModel.findOne({
      quest: new mongoose.Types.ObjectId(quest._id),
      user: new mongoose.Types.ObjectId(userId),
    });
    if (currentProgress)
      throw new UnprocessableEntityException('Invalid Action');
    const newProgress = new this.progressModel({
      quest: quest._id,
      score: quest.reward,
      user: userId,
    });
    const progress = await newProgress.save();
    return transformer(BaseViewmodel, circularToJSON(progress));
  }
}
