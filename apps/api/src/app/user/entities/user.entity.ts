import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text' })
  inviteCode: string;

  @Column({ type: 'text' })
  usedInviteCode: string;
}
