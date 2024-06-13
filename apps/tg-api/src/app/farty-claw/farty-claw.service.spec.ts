import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Invoice } from '../invoice';

import { FartyClawService } from './farty-claw.service';

describe('FartyClawService', () => {
  let service: FartyClawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FartyClawService,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Invoice,
        },
      ],
    }).compile();

    service = module.get<FartyClawService>(FartyClawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
