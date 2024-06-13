import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice, InvoiceService } from '../invoice';

import { FartyClawController } from './farty-claw.controller';
import { FartyClawService } from './farty-claw.service';

@Module({
  controllers: [FartyClawController],
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [FartyClawService, InvoiceService],
})
export class FartyClawModule {
  // no op
}
