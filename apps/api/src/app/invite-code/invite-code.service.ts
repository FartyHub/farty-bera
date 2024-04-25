import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectInvite } from '../project-invite';
import { User } from '../user';

import { CheckInviteCodeDto } from './dto/check-invite-code';

@Injectable()
export class InviteCodeService {
  private readonly logger: Logger = new Logger(InviteCodeService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectInvite)
    private readonly projectInviteRepository: Repository<ProjectInvite>,
  ) {}

  async checkInviteCode(checkInviteCodeDto: CheckInviteCodeDto) {
    this.logger.log(
      `[CHECK_INVITE_CODE] ${JSON.stringify(checkInviteCodeDto, null, 2)}`,
    );

    try {
      const { address, inviteCode } = checkInviteCodeDto;
      const currentUser = await this.userRepository.findOne({
        where: { address },
      });

      if (!currentUser) {
        throw new Error('User not found');
      }

      const projectInvite = await this.projectInviteRepository.findOne({
        where: { inviteCode },
      });

      if (!projectInvite) {
        const user = await this.userRepository.findOne({
          where: { inviteCode },
        });

        if (!user) {
          throw new Error('Invalid invite code');
        }

        const usedCounts = await this.userRepository.count({
          where: { usedInviteCode: inviteCode },
        });

        if (user.inviteCodeLimit <= usedCounts) {
          throw new Error('Invite code limit exceeded');
        }

        currentUser.usedInviteCode = inviteCode;
      } else {
        const usedCounts = await this.userRepository.count({
          where: { usedInviteCode: inviteCode },
        });

        if (projectInvite.inviteCodeLimit <= usedCounts) {
          throw new Error('Invite code limit exceeded');
        }

        currentUser.usedInviteCode = inviteCode;
      }

      await this.userRepository.save(currentUser);

      return currentUser;
    } catch (error) {
      this.logger.error(`[CHECK_INVITE_CODE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
