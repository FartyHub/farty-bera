import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user';

import { Score } from './entities/score.entity';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

@Module({
  controllers: [ScoreController],
  exports: [ScoreService],
  imports: [TypeOrmModule.forFeature([Score, User])],
  providers: [ScoreService],
})
export class ScoreModule {}
