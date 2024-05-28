/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable no-magic-numbers */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';

import {
  calculateHoneyScore,
  forwardDateByDays,
  generateRandomText,
  verifyAuthenticationMessage,
} from '../../utils';
import { ACCESS_TOKEN, SignDto } from '../common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const SCORE_THRESHOLD = 35;

function removeInviteCode(user: User) {
  user.inviteCode = undefined;
  user.usedInviteCode = undefined;
  user.fartyHighScore = undefined;
  user.inviteCodeLimit = undefined;

  return user;
}

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginWithSignature(signDto: SignDto, response: Response) {
    const { address, verified } = await verifyAuthenticationMessage(signDto);

    if (!verified) {
      throw new BadRequestException('Verify signature failed.');
    }

    const userData = { address };
    let user = await this.usersRepository.findOne({ where: { address } });

    if (!user) {
      user = await this.create(userData);
    }

    this.logger.log('[loginWithSignature] UserService', userData);

    const payload = {
      userAddress: userData.address,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_SESSION_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });

    response.cookie(ACCESS_TOKEN, accessToken, {
      expires: forwardDateByDays(7),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    const responseData = {
      user: {
        address: user.address,
        displayName: user.displayName,
        honeyScore: user.honeyScore,
        inviteCode: user.inviteCode,
        usedInviteCode: user.usedInviteCode,
        id: user.id,
        createdAt: user.createdAt,
      },
      accessToken: accessToken,
    };

    return response.send(responseData);
  }

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

  async findAll() {
    this.logger.log(`[GET_USERS]`);

    const users = await this.usersRepository.find();

    return users.map(removeInviteCode);
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
      return await this.usersRepository.findOneOrFail({
        where: { address },
      });
    } catch (error) {
      this.logger.error(`[GET_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(address: string, updateUserDto: UpdateUserDto, authUser: User) {
    this.logger.log(`[UPDATE_USER] ${address}`);

    try {
      if (authUser.address !== address) {
        throw new Error('Unauthorized');
      }

      if (updateUserDto.displayName && updateUserDto.displayName.length > 20) {
        throw new Error('Should be less than 20 characters');
      }

      const user = await this.findOne(address);

      user.honeyScore = calculateHoneyScore(
        user.fartyGamesPlayed,
        user.fartyHighScore,
      );

      if (user.honeyScore >= SCORE_THRESHOLD) {
        user.inviteCode = generateRandomText(6);
      }

      if (updateUserDto.displayName) {
        user.displayName = updateUserDto.displayName;
      }

      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      this.logger.error(`[UPDATE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(address: string) {
    this.logger.log(`[DELETE_USER] ${address}`);

    try {
      const user = await this.findOne(address);
      user.deletedAt = new Date();

      await this.usersRepository.save(user);

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
      const users = await this.usersRepository.find({
        order: {
          honeyScore: 'DESC',
          fartyGamesPlayed: 'DESC',
          createdAt: 'ASC',
        },
        take: 20,
      });

      return users.map(removeInviteCode);
    } catch (error) {
      this.logger.error(`[GET_TOP_RANKS] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
