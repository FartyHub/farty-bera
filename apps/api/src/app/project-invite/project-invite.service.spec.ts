import { Test, TestingModule } from '@nestjs/testing';

import { ProjectInviteService } from './project-invite.service';

describe('ProjectInviteService', () => {
  let service: ProjectInviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectInviteService],
    }).compile();

    service = module.get<ProjectInviteService>(ProjectInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
