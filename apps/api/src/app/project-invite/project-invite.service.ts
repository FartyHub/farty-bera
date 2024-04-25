import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectInviteDto } from './dto/create-project-invite.dto';
import { ProjectInvite } from './entities/project-invite.entity';

@Injectable()
export class ProjectInviteService {
  private readonly logger: Logger = new Logger(ProjectInviteService.name);

  constructor(
    @InjectRepository(ProjectInvite)
    private projectInviteRepository: Repository<ProjectInvite>,
  ) {}

  async create(createProjectInviteDto: CreateProjectInviteDto) {
    this.logger.log(
      `[CREATE_PROJECT_INVITE] ${JSON.stringify(createProjectInviteDto, null, 2)}`,
    );

    try {
      return await this.projectInviteRepository.save(createProjectInviteDto);
    } catch (error) {
      this.logger.error(`[CREATE_PROJECT_INVITE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
