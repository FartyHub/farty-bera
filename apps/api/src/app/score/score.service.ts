/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
import { hashSHA256 } from '@farty-bera/commons';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { calculateHoneyScore, verifyAuthenticationMessage } from '../../utils';
import { Applications, SignDto } from '../common';
import { User } from '../user';

import { SoleCreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './entities/score.entity';

const _408 = 408;
const _408_THRESHOLD = '240';

@Injectable()
export class ScoreService {
  private readonly logger: Logger = new Logger(ScoreService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async create(
    createScoreDto: SoleCreateScoreDto,
    user: User,
    signDto: SignDto,
  ) {
    const { hash, ...rest } = createScoreDto;
    this.logger.log(
      `[CREATE_SCORE] ${JSON.stringify(createScoreDto, null, 2)}`,
    );

    try {
      if (hash !== hashSHA256(rest.value.toString(), signDto.key)) {
        throw new BadRequestException('Invalid score');
      }

      const { address, verified } = await verifyAuthenticationMessage(signDto);

      if (!verified) {
        throw new BadRequestException('Invalid score');
      }

      if (
        user.address !== createScoreDto.userAddress ||
        user.address !== address
      ) {
        throw new BadRequestException('Invalid score');
      }

      const score = this.scoresRepository.create(rest);

      if (
        parseFloat(score.time) <= parseFloat(_408_THRESHOLD) &&
        score.game === Applications.FARTY_BERA &&
        score.value > _408
      ) {
        throw new BadRequestException('Invalid score');
      }

      if (
        user.fartyHighScore < score.value &&
        score.game === Applications.FARTY_BERA
      ) {
        user.fartyHighScore = score.value;
      }

      user.fartyGamesPlayed += 1;
      user.honeyScore = calculateHoneyScore(
        user.fartyGamesPlayed,
        user.fartyHighScore,
      );

      await this.userRepository.save(user);

      return await this.scoresRepository.save(score);
    } catch (error) {
      this.logger.error(`[CREATE_SCORE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

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

  async findAll(address: string) {
    this.logger.log(`[GET_SCORES] ${address}`);

    try {
      return await this.scoresRepository.find({
        where: { userAddress: address },
      });
    } catch (error) {
      this.logger.error(`[GET_SCORES] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    this.logger.log(`[GET_SCORE] ${id}`);

    try {
      return await this.scoresRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      this.logger.error(`[GET_SCORE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateScoreDto: UpdateScoreDto) {
    this.logger.log(`[UPDATE_SCORE] ${id}`);

    try {
      const score = await this.findOne(id);
      const newScore = this.scoresRepository.create({
        ...score,
        ...updateScoreDto,
      });

      await this.scoresRepository.save(newScore);

      return newScore;
    } catch (error) {
      this.logger.error(`[UPDATE_SCORE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    this.logger.log(`[DELETE_SCORE] ${id}`);

    try {
      await this.scoresRepository.update(id, { deletedAt: new Date() });

      return true;
    } catch (error) {
      this.logger.error(`[DELETE_SCORE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
