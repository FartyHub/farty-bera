import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../user';

import { CheckInviteCodeDto } from './dto/check-invite-code';
import { InviteCodeService } from './invite-code.service';

@ApiTags('InviteCode')
@Controller('invite-code')
export class InviteCodeController {
  constructor(private readonly inviteCodeService: InviteCodeService) {}

  @Post()
  @ApiOkResponse({ type: User })
  checkInviteCode(
    @Body() checkInviteCodeDto: CheckInviteCodeDto,
  ): Promise<User> {
    return this.inviteCodeService.checkInviteCode(checkInviteCodeDto);
  }
}
