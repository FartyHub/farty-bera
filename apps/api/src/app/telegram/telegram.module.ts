import { Module } from '@nestjs/common';
import { getBotToken } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramService,
    {
      provide: 'fartyberabot',
      useExisting: Telegraf<Context>,
    },
  ],
})
export class TelegramModule {
  // no op
}
