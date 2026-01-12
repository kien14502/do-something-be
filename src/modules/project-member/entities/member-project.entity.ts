import { BaseEntity } from 'src/core/base/base.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { WORKSPACE_ROLE } from 'src/shared/enums/workspace';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TABLE_NAME.PROJECT_MEMBER)
export class ProjectMember extends BaseEntity {
  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: WORKSPACE_ROLE,
    default: WORKSPACE_ROLE.MEMBER,
  })
  role: WORKSPACE_ROLE;

  @ManyToOne(() => Project, (prj) => prj.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
