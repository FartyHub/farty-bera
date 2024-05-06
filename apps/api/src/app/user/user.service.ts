/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable no-magic-numbers */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { calculateHoneyScore, generateRandomText } from '../../utils';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const SCORE_THRESHOLD = 35;

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    this.logger.log(`[CREATE_USER] ${JSON.stringify(createUserDto, null, 2)}`);

    try {
      const user = this.usersRepository.create(createUserDto);

      return this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(`[CREATE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    this.logger.log(`[GET_USERS]`);

    return this.usersRepository.find();
  }

  findAllInvitedCount() {
    this.logger.log(`[GET_USERS_INVITED_COUNT]`);

    try {
      return this.usersRepository
        .createQueryBuilder('user')
        .where('user.usedInviteCode IS NOT NULL')
        .getCount();
    } catch (error) {
      this.logger.error(`[GET_USERS_INVITED_COUNT] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(address: string) {
    this.logger.log(`[GET_USER] ${address}`);

    try {
      return await this.usersRepository.findOneOrFail({ where: { address } });
    } catch (error) {
      this.logger.error(`[GET_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(address: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`[UPDATE_USER] ${address}`);

    try {
      if (updateUserDto.displayName && updateUserDto.displayName.length > 20) {
        throw new Error('Should be less than 20 characters');
      }

      const user = await this.findOne(address);
      const newUser = this.usersRepository.create({
        ...user,
        ...updateUserDto,
      });

      newUser.honeyScore = calculateHoneyScore(
        newUser.fartyGamesPlayed,
        newUser.fartyHighScore,
      );

      if (newUser.honeyScore >= SCORE_THRESHOLD) {
        newUser.inviteCode = generateRandomText(6);
      }

      await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      this.logger.error(`[UPDATE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(address: string) {
    this.logger.log(`[DELETE_USER] ${address}`);

    try {
      await this.update(address, { deletedAt: new Date() });

      return true;
    } catch (error) {
      this.logger.error(`[DELETE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async generateInviteCode(address: string) {
    this.logger.log(`[GENERATE_INVITE_CODE] ${address}`);

    try {
      const user = await this.findOne(address);
      const inviteCode = generateRandomText(6);

      user.inviteCode = inviteCode;

      await this.usersRepository.save(user);

      return inviteCode;
    } catch (error) {
      this.logger.error(`[GENERATE_INVITE_CODE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserRank(address: string) {
    this.logger.log(`[GET_USER_RANK] ${address}`);

    try {
      const user = await this.findOne(address);

      const usersBeforeCount = await this.usersRepository
        .createQueryBuilder('user')
        .where(
          'honey_score > :honeyScore OR (honey_score = :honeyScore AND farty_games_played > :fartyGamesPlayed) OR (honey_score = :honeyScore AND farty_games_played = :fartyGamesPlayed AND created_at < :createdAt)',
          {
            honeyScore: user.honeyScore,
            fartyGamesPlayed: user.fartyGamesPlayed,
            createdAt: user.createdAt,
          },
        )
        .getCount();

      return usersBeforeCount + 1;
    } catch (error) {
      this.logger.error(`[GET_USER_RANK] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async getTopRanks() {
    this.logger.log(`[GET_TOP_RANKS]`);

    try {
      return await this.usersRepository.find({
        order: {
          honeyScore: 'DESC',
          fartyGamesPlayed: 'DESC',
          createdAt: 'ASC',
        },
        take: 20,
      });
    } catch (error) {
      this.logger.error(`[GET_TOP_RANKS] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
