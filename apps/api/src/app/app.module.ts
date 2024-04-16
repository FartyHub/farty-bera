import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtGuard } from './common';
import { User, UserModule } from './user';

const defaultDBOptions = {
  autoLoadEntities: true,
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
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      ...defaultDBOptions,
      database: process.env.DB_DATABASE,
      entities: [User],
      type: 'postgres',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    AppService,
  ],
})
export class AppModule {}
