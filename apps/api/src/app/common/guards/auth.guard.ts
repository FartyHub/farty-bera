/* eslint-disable sonarjs/no-duplicate-string */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { AuthenticatedRequest, DecodedAccessToken } from '../../../types';
import { verifyAuthenticationMessage } from '../../../utils';
import { User } from '../../user';
import {
  ACCESS_TOKEN,
  ConfigKeys,
  IS_API_KEY,
  IS_PUBLIC_KEY,
} from '../constants';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      const isApiKey = this.reflector.getAllAndOverride<boolean>(IS_API_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

      if (typeof request.get !== 'function') {
        const telegramApiKey = this.configService.get<string>(
          ConfigKeys.TelegramApiKey,
        );
        const argumentToken = context.getArgs()?.[0]?.telegram?.token;

        if (telegramApiKey === argumentToken) {
          return true;
        } else {
          throw new UnauthorizedException('Invalid access token');
        }
      }

      const requestApiKey = request.get('x-api-key');

      if (requestApiKey && isApiKey) {
        this.logger.log(
          '[API] Using API key from auth header: ',
          requestApiKey,
        );
        const backendApiKey = this.configService.get<string>(ConfigKeys.ApiKey);

        const isValid = requestApiKey === backendApiKey;

        if (!isValid) {
          throw new UnauthorizedException('Invalid Api Key');
        }

        return true;
      }

      let accessToken =
        request.cookies[ACCESS_TOKEN] ?? request.get(ACCESS_TOKEN);

      const token = request.get('Authorization')?.split(' ')?.[1];

      if (!accessToken && token && token !== 'undefined') {
        this.logger.debug('Using token from auth header');

        accessToken = token;
      }

      if (accessToken) {
        const { userAddress } = this.decodeAccessToken(accessToken) || {};

        const user = await this.usersRepository.findOne({
          where: { address: userAddress },
        });

        request.accessToken = accessToken;
        request.user = user;

        return true;
      }

      const key = request.get('key');
      const message = request.get('message');
      const signature = request.get('signature');

      if (key && message && signature) {
        const { address, verified } = await verifyAuthenticationMessage({
          key,
          message,
          signature,
        });

        if (!verified) {
          throw new UnauthorizedException('Invalid access token');
        }

        const user = await this.usersRepository.findOne({
          where: { address: address },
        });

        request.user = user;

        return true;
      }
    } catch (e) {
      this.logger.error(e);

      throw new UnauthorizedException('Invalid access token');
    }
  }

  decodeAccessToken(accessToken: string) {
    try {
      const decodedToken = verify(
        accessToken,
        process.env.JWT_SECRET,
      ) as DecodedAccessToken;

      return {
        userAddress: decodedToken?.userAddress,
      };
    } catch (e) {
      this.logger.warn('Unable to decode client access token', e);

      throw new UnauthorizedException('Invalid access token');
    }
  }
}
