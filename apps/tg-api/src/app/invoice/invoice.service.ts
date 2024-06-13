import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  private readonly logger: Logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {
    // no op
  }

  create(createInvoiceDto: Partial<Invoice>) {
    this.logger.log('[CREATE]', JSON.stringify(createInvoiceDto, null, 2));

    this.invoiceRepository.create(createInvoiceDto);

    return this.invoiceRepository.save(createInvoiceDto);
  }

  findAll() {
    this.logger.log('[FIND_ALL]');

    return this.invoiceRepository.find();
  }

  findOne(id: string) {
    this.logger.log('[FIND_ONE]', id);

    return this.invoiceRepository.findOneOrFail({
      where: { id },
    });
  }

  update(id: string, updateInvoiceDto: Partial<Invoice>) {
    this.logger.log(
      '[UPDATE]',
      JSON.stringify({ id, updateInvoiceDto }, null, 2),
    );

    return this.invoiceRepository.update(id, updateInvoiceDto);
  }

  remove(id: string) {
    this.logger.log('[REMOVE]', id);

    return this.invoiceRepository.update(id, {
      deletedAt: new Date(),
    });
  }
}
