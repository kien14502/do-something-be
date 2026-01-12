import { BaseEntity } from 'src/core/base/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Workspace } from 'src/modules/workspace/entities/workspace.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import {
  WORKSPACE_ROLE,
  WORKSPACE_STATUS_INVITE,
} from 'src/shared/enums/workspace';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: TABLE_NAME.WORKSPACE_MEMBER })
export class WorkspaceMember extends BaseEntity {
  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: WORKSPACE_ROLE,
    default: WORKSPACE_ROLE.MEMBER,
  })
  role: WORKSPACE_ROLE;

  @Column({
    name: 'status_invite',
    enum: WORKSPACE_STATUS_INVITE,
    enumName: 'WORKSPACE_STATUS_INVITE',
  })
  statusInvite: WORKSPACE_STATUS_INVITE;

  @ManyToOne(() => Workspace, (org) => org.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @ManyToOne(() => User, (user) => user.workspaceMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
