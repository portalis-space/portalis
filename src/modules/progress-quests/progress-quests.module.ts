import { Module } from '@nestjs/common';
import { ProgressQuestsController } from './controllers/progress-quests.controller';
import { ProgressQuestsService } from './services/progress-quests.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProgressQuest,
  ProgressQuestSchema,
} from '@config/dbs/progress-quest.model';
import { Quest, QuestSchema } from '@config/dbs/quest.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quest.name, schema: QuestSchema }]),
    MongooseModule.forFeature([
      { name: ProgressQuest.name, schema: ProgressQuestSchema },
    ]),
  ],
  controllers: [ProgressQuestsController],
  providers: [ProgressQuestsService],
})
export class ProgressQuestsModule {}
