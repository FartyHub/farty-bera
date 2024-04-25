import { PartialType } from '@nestjs/swagger';

import { CreateProjectInviteDto } from './create-project-invite.dto';

export class UpdateProjectInviteDto extends PartialType(
  CreateProjectInviteDto,
) {}
