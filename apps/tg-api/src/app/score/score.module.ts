import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Score } from './entities/score.entity';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

@Module({
  controllers: [ScoreController],
  exports: [ScoreService],
  imports: [TypeOrmModule.forFeature([Score])],
  providers: [ScoreService],
})
export class ScoreModule {}
