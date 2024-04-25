import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectInvite } from './entities/project-invite.entity';
import { ProjectInviteService } from './project-invite.service';

describe('ProjectInviteService', () => {
  let service: ProjectInviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectInviteService,
        {
          provide: getRepositoryToken(ProjectInvite),
          useClass: ProjectInvite,
        },
      ],
    }).compile();

    service = module.get<ProjectInviteService>(ProjectInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
