import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateProjectInviteDto } from './dto/create-project-invite.dto';
import { ProjectInvite } from './entities/project-invite.entity';
import { ProjectInviteService } from './project-invite.service';

@ApiTags('ProjectInvites')
@Controller('project-invites')
export class ProjectInviteController {
  constructor(private readonly projectInviteService: ProjectInviteService) {}

  @Post()
  @ApiOkResponse({ type: ProjectInvite })
  create(
    @Body() createProjectInviteDto: CreateProjectInviteDto,
  ): Promise<ProjectInvite> {
    return this.projectInviteService.create(createProjectInviteDto);
  }
}
