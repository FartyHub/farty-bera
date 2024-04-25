import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectInvite } from '../project-invite';
import { User } from '../user';

import { InviteCodeController } from './invite-code.controller';
import { InviteCodeService } from './invite-code.service';

@Module({
  controllers: [InviteCodeController],
  imports: [TypeOrmModule.forFeature([ProjectInvite, User])],
  providers: [InviteCodeService],
})
export class InviteCodeModule {}
