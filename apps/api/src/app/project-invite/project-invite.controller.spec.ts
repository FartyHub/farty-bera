import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectInvite } from './entities/project-invite.entity';
import { ProjectInviteController } from './project-invite.controller';
import { ProjectInviteService } from './project-invite.service';

describe('ProjectInviteController', () => {
  let controller: ProjectInviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectInviteController],
      providers: [
        ProjectInviteService,
        {
          provide: getRepositoryToken(ProjectInvite),
          useClass: ProjectInvite,
        },
      ],
    }).compile();

    controller = module.get<ProjectInviteController>(ProjectInviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
