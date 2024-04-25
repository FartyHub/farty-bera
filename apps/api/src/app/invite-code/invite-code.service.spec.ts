import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectInvite } from '../project-invite';
import { User } from '../user';

import { InviteCodeService } from './invite-code.service';

describe('InviteCodeService', () => {
  let service: InviteCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteCodeService,
        {
          provide: getRepositoryToken(ProjectInvite),
          useClass: ProjectInvite,
        },
        {
          provide: getRepositoryToken(User),
          useClass: User,
        },
      ],
    }).compile();

    service = module.get<InviteCodeService>(InviteCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
