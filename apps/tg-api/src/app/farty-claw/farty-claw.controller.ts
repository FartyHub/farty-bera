import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiKey } from '../common';

import { FartyClawService } from './farty-claw.service';

@ApiTags('FartyClaw')
@Controller('farty-claw')
export class FartyClawController {
  constructor(private readonly fartyClawService: FartyClawService) {
    // no op
  }

  @Get('invoice/:amount')
  @ApiKey()
  getInvoiceLink(@Param('amount') amount: string) {
    return this.fartyClawService.getInvoiceLink(+amount);
  }
}
