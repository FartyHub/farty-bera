import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigKeys, JwtGuard } from './common';
import { FartyBeraBotUpdate } from './farty-bera-bot';
import { FartyClawModule } from './farty-claw';
import { FartyClawUsers } from './farty-claw-user';
import { Invoice, InvoiceModule, InvoiceService } from './invoice';
import { Score, ScoreModule } from './score';
import { TelegramModule } from './telegram';

const defaultDBOptions = {
  autoLoadEntities: true,
  extra: {
    socketPath: process.env.DB_HOST,
  },
  host: process.env.DB_HOST,
  namingStrategy: new SnakeNamingStrategy(),
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  synchronize: false,
  username: process.env.DB_USERNAME,
};

console.log('defaultDBOptions: ', defaultDBOptions);

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
    TypeOrmModule.forFeature([Invoice, FartyClawUsers, Score]),
    TypeOrmModule.forRoot({
      ...defaultDBOptions,
      database: process.env.DB_DATABASE,
      entities: [Invoice, FartyClawUsers, Score],
      type: 'postgres',
    }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // launchOptions: {
        //   allowedUpdates: [
        //     'message',
        //     'callback_query',
        //     'inline_query',
        //     'pre_checkout_query',
        //   ],
        // },
        options: {
          telegram: {
            testEnv: process.env.ENVIRONMENT !== 'production',
          },
        },
        token: configService.get<string>(ConfigKeys.TelegramApiKey),
      }),
    }),
    TelegramModule,
    FartyClawModule,
    InvoiceModule,
    ScoreModule,
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
    InvoiceService,
    FartyBeraBotUpdate,
    {
      provide: Repository,
      useClass: FartyClawUsers,
    },
  ],
})
export class AppModule {
  // no op
}
