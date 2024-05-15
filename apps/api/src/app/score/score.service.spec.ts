import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User, UserService } from '../user';

import { Score } from './entities/score.entity';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
  let service: ScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        UserService,
        {
          provide: getRepositoryToken(Score),
          useClass: Score,
        },
        {
          provide: getRepositoryToken(User),
          useClass: User,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
