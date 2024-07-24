/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SoleCreateScoreDto } from './dto/create-score.dto';
import { Score } from './entities/score.entity';

@Injectable()
export class ScoreService {
  private readonly logger: Logger = new Logger(ScoreService.name);

  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async createFartyClaw(createScoreDtos: SoleCreateScoreDto[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scoresToCreate = createScoreDtos.map(({ hash, ...rest }) => rest);
    this.logger.log(
      `[CREATE_SCORE_FARTY_CLAW] ${JSON.stringify(createScoreDtos, null, 2)}`,
    );

    try {
      const scores = this.scoresRepository.create(scoresToCreate);

      await this.scoresRepository.save(scores);

      return true;
    } catch (error) {
      this.logger.error(`[CREATE_SCORE_FARTY_CLAW] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(userAddress: string, date?: Date): Promise<Score> {
    this.logger.log(`[GET_SCORE] ${userAddress}`, date);

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
