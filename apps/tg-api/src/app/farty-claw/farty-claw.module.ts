import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FartyClawUsers } from '../farty-claw-user';
import { Invoice, InvoiceService } from '../invoice';
import { Score, ScoreService } from '../score';

import { FartyClawController } from './farty-claw.controller';
import { FartyClawService } from './farty-claw.service';

@Module({
  controllers: [FartyClawController],
  imports: [TypeOrmModule.forFeature([Invoice, FartyClawUsers, Score])],
  providers: [FartyClawService, InvoiceService, ConfigService, ScoreService],
})
export class FartyClawModule {
  // no op
}
