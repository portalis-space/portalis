import { Module } from '@nestjs/common';
import { QuestsController } from './controllers/quests.controller';
import { QuestsService } from './services/quests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Quest, QuestSchema } from '@config/dbs/quest.model';
import { QuestAdminController } from './controllers/quests.admin.controller';
import {
  ProgressQuest,
  ProgressQuestSchema,
} from '@config/dbs/progress-quest.model';
import { AdmGuard } from 'modules/common/guards/adm.guard';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quest.name, schema: QuestSchema }]),
    MongooseModule.forFeature([
      { name: ProgressQuest.name, schema: ProgressQuestSchema },
    ]),
    AuthModule,
  ],
  controllers: [QuestsController, QuestAdminController],
  providers: [QuestsService],
})
export class QuestsModule {}
