import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Score } from './entities/score.entity';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
  let service: ScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        {
          provide: getRepositoryToken(Score),
          useClass: Score,
        },
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
