import { ApiProperty } from '@nestjs/swagger';
import { BasePayload } from 'src/common/dtos/common.dto';
import { BaseEntity } from 'src/core/base/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { NotificationType } from 'src/shared/enums/notification';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: TABLE_NAME.NOTIFICATION })
@Index(['userId', 'isRead'])
export class Notification extends BaseEntity {
  @ApiProperty()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty()
  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId?: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  @Column({ type: 'jsonb' })
  payload: BasePayload;

  @ApiProperty()
  @Column({ default: false })
  isRead: boolean;

  /** relations */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_id' })
  actor?: User;
}
