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

import { ConfigKeys, IS_API_KEY, IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
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

      const request = context.switchToHttp().getRequest();

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
    } catch (e) {
      this.logger.error(e);

      throw new UnauthorizedException('Invalid access token');
    }
  }
}
