import { Quest, QuestDocument } from '@config/dbs/quest.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateQuestDto, UpdateQuestDto } from '../dtos/quests.dto';
import { circularToJSON, transformer } from '@utils/helpers';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { StatusEnum } from '@utils/enums';
import { ProgressQuest } from '@config/dbs/progress-quest.model';

@Injectable()
export class QuestsService {
  private logger = new Logger(QuestsService.name);
  constructor(
    @InjectModel(Quest.name) private readonly questModel: Model<Quest>,
  ) {}

  async createQuest(dto: CreateQuestDto) {
    const newQuest = new this.questModel(dto);
    const quest = await newQuest.save();
    return transformer(BaseViewmodel, circularToJSON(quest));
  }

  async listQuest(userId?: string) {
    const quests = await this.questModel
      .find({
        ...(userId && { status: StatusEnum.ACTIVE }),
      })
      .populate({
        path: 'progress',
        ...(userId && { match: { user: userId } }),
      });
    return circularToJSON(quests);
  }

  async updateQuest(id: string, dto: UpdateQuestDto) {
    const quest = await this.questModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      dto,
      { returnDocument: 'after' },
    );
    return transformer(BaseViewmodel, circularToJSON(quest));
  }
}
