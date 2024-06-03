import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtGuard } from './common';
import { FartyBeraBotUpdate } from './farty-bera-bot';
import { TelegramModule } from './telegram';

@Module({
  controllers: [AppController],
  imports: [
    ThrottlerModule.forRoot([
      {
        limit: 100,
        ttl: 6000,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        botName: 'fartyberabot',
        launchOptions: {
          allowedUpdates: ['message', 'callback_query', 'inline_query'],
        },
        options: {
          telegram: {
            // testEnv: process.env.ENVIRONMENT !== 'production',
          },
        },
        token: process.env.TELEGRAM_API_KEY,
      }),
    }),
    TelegramModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    Logger,
    AppService,
    FartyBeraBotUpdate,
  ],
})
export class AppModule {
  // no op
}
