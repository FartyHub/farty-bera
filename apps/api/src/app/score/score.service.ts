import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Applications } from '../common';
import { User } from '../user';

import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './entities/score.entity';

@Injectable()
export class ScoreService {
  private readonly logger: Logger = new Logger(ScoreService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    this.logger.log(
      `[CREATE_SCORE] ${JSON.stringify(createScoreDto, null, 2)}`,
    );

    try {
      const score = this.scoresRepository.create(createScoreDto);
      const user = await this.userRepository.findOneOrFail({
        where: { address: createScoreDto.userAddress },
      });

      if (
        user.fartyHighScore < score.value &&
        score.game === Applications.FARTY_BERA
      ) {
        user.fartyHighScore = score.value;
      }

      user.fartyGamesPlayed += 1;

      await this.userRepository.save(user);

      return await this.scoresRepository.save(score);
    } catch (error) {
      this.logger.error(`[CREATE_SCORE] ${error.message}`);

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
