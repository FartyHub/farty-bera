import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({
    generated: 'uuid',
    type: 'uuid',
  })
  id: string;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
    type: 'timestamp',
  })
  deletedAt: Date;
}
