import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiKey } from '../common';

import { InvoiceService } from './invoice.service';

@ApiTags('Invoice')
@Controller('invoice')
@ApiKey()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {
    // no pp
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }
}
