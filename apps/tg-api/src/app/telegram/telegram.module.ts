import { Module } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramService,
    {
      provide: 'fartyberabotBot',
      useClass: Telegraf<Context>,
    },
  ],
})
export class TelegramModule {
  // no op
}
