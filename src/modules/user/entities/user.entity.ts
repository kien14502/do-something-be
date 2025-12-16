import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/base/base.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { Entity, Column } from 'typeorm';

@Entity({ name: TABLE_NAME.USER })
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ length: 500 })
  name: string;

  @ApiProperty()
  @Column({ length: 500 })
  email: string;

  @ApiProperty()
  @Column({ length: 500 })
  password: string;

  @ApiProperty()
  @Column({ length: 500 })
  avatar: string;
}
