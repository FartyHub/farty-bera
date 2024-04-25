import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProjectInviteService } from './project-invite.service';

@ApiTags('ProjectInvites')
@Controller('project-invites')
export class ProjectInviteController {
  constructor(private readonly projectInviteService: ProjectInviteService) {}
}
