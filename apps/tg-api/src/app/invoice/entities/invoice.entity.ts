import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryColumn({
    generated: 'uuid',
    type: 'uuid',
  })
  @ApiProperty()
  @IsString()
  id: string;

  @DeleteDateColumn({
    nullable: true,
    type: 'timestamp',
  })
  @ApiProperty({ nullable: true })
  @IsDate()
  deletedAt: Date;

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
