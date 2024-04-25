import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectInvite } from '../project-invite';
import { User } from '../user';

import { InviteCodeController } from './invite-code.controller';
import { InviteCodeService } from './invite-code.service';

describe('InviteCodeController', () => {
  let controller: InviteCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteCodeController],
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

    controller = module.get<InviteCodeController>(InviteCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
