import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  preCheckoutQueryId: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  firstName: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  lastName: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  currency: string;

  @Column({ default: 0, type: 'int' })
  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  telegramPaymentChargeId: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  providerPaymentChargeId: string;
}
