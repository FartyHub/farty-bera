import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectInvite } from './entities/project-invite.entity';
import { ProjectInviteController } from './project-invite.controller';
import { ProjectInviteService } from './project-invite.service';

@Module({
  controllers: [ProjectInviteController],
  imports: [TypeOrmModule.forFeature([ProjectInvite])],
  providers: [ProjectInviteService],
})
export class ProjectInviteModule {}
