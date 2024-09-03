import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtGuard } from './common';
import { FartyBeraBotUpdate } from './farty-bera-bot';
import { FartyClawUsers } from './farty-claw-user';
import { InviteCodeModule } from './invite-code';
import { Invoice } from './invoice';
import { ProjectInvite, ProjectInviteModule } from './project-invite';
import { Score, ScoreModule } from './score';
import { TaskModule } from './task/task.module';
import { TelegramModule } from './telegram';
import { TwitterModule } from './twitter';
import { User, UserModule } from './user';
import { UserTaskModule } from './user-task/user-task.module';

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

@Module({
  controllers: [AppController],
  imports: [
    ThrottlerModule.forRoot([
      {
        limit: 100,
        ttl: 6000,
      },
    ]),
    TypeOrmModule.forRoot({
      ...defaultDBOptions,
      database: process.env.DB_DATABASE,
      entities: [User, Score, ProjectInvite, Invoice, FartyClawUsers],
      type: 'postgres',
    }),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TelegrafModule.forRootAsync({
    //   useFactory: () => ({
    //     botName: 'fartyberabot',
    //     launchOptions: {
    //       allowedUpdates: ['message', 'callback_query', 'inline_query'],
    //     },
    //     options: {
    //       telegram: {
    //         testEnv: process.env.ENVIRONMENT !== 'production',
    //       },
    //     },
    //     token: process.env.TELEGRAM_API_KEY,
    //   }),
    // }),
    UserModule,
    ScoreModule,
    ProjectInviteModule,
    InviteCodeModule,
    TaskModule,
    UserTaskModule,
    TwitterModule,
    // TelegramModule,
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
    // FartyBeraBotUpdate,
  ],
})
export class AppModule {
  // no op
}
