import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Invoice } from '../invoice';

import { FartyClawController } from './farty-claw.controller';
import { FartyClawService } from './farty-claw.service';

describe('FartyClawController', () => {
  let controller: FartyClawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FartyClawController],
      providers: [
        FartyClawService,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Invoice,
        },
      ],
    }).compile();

    controller = module.get<FartyClawController>(FartyClawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
