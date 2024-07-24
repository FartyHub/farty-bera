/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Score } from './entities/score.entity';

@Injectable()
export class ScoreService {
  private readonly logger: Logger = new Logger(ScoreService.name);

  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async findOne(userAddress: string, date?: Date): Promise<Score> {
    this.logger.log(`[GET_SCORE] ${userAddress}`);

    try {
      let query = this.scoresRepository
        .createQueryBuilder('score')
        .where('score.userAddress = :userAddress', { userAddress });

      if (date) {
        query = query.andWhere('score.createdAt <= :date', { date });
      }

      query = query.orderBy('score.createdAt', 'DESC');

      return await query.getOne();
    } catch (error) {
      this.logger.error(`[GET_SCORE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
