import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FartyClawUsers } from '../farty-claw-user';
import { Invoice, InvoiceService } from '../invoice';

import { FartyClawController } from './farty-claw.controller';
import { FartyClawService } from './farty-claw.service';

@Module({
  controllers: [FartyClawController],
  imports: [TypeOrmModule.forFeature([Invoice, FartyClawUsers])],
  providers: [FartyClawService, InvoiceService, ConfigService],
})
export class FartyClawModule {
  // no op
}
