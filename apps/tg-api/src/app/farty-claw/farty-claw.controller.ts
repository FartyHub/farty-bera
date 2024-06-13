import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiKey } from '../common';

import { FartyClawService } from './farty-claw.service';

@ApiTags('FartyClaw')
@Controller('farty-claw')
export class FartyClawController {
  constructor(private readonly fartyClawService: FartyClawService) {
    // no op
  }

  @Get('invoice')
  @ApiKey()
  getInvoiceLink() {
    return this.fartyClawService.getInvoiceLink();
  }
}
