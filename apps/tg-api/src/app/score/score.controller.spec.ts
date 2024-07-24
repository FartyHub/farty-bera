import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Score } from './entities/score.entity';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

describe('ScoreController', () => {
  let controller: ScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [
        ScoreService,
        {
          provide: getRepositoryToken(Score),
          useClass: Score,
        },
      ],
    }).compile();

    controller = module.get<ScoreController>(ScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
