import { Test, TestingModule } from '@nestjs/testing';

import { ProjectInviteController } from './project-invite.controller';
import { ProjectInviteService } from './project-invite.service';

describe('ProjectInviteController', () => {
  let controller: ProjectInviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectInviteController],
      providers: [ProjectInviteService],
    }).compile();

    controller = module.get<ProjectInviteController>(ProjectInviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
