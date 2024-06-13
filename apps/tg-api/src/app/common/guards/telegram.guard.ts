/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly timeout = 100;

  private timestamps: any = [];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();
    const prevTimestamp = this.timestamps[from.id];
    const timestamp = new Date().getTime();
    if (prevTimestamp && prevTimestamp > timestamp - this.timeout)
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    this.timestamps[from.id] = timestamp;

    return true;
  }
}
