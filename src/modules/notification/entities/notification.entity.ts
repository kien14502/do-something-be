import { BasePayload } from 'src/common/dtos/common.dto';
import { BaseEntity } from 'src/core/base/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { NotificationType } from 'src/shared/enums/notification';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: TABLE_NAME.NOTIFICATION })
export class Notification extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column('json')
  payload: BasePayload;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
