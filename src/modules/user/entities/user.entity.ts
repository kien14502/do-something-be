import { BaseEntity } from 'src/core/base/base.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { Entity, Column } from 'typeorm';

@Entity({ name: TABLE_NAME.USER })
export class User extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({ length: 500, unique: true })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ nullable: true, default: false })
  verified: boolean;

  @Column({ nullable: true, default: null })
  refresh_token: string;
}
