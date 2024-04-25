import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { ConfigKeys } from '../constants';

const IS_PUBLIC_KEY = 'isPublic';

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

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();

      const requestApiKey = request.get('x-api-key');

      if (requestApiKey) {
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

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
