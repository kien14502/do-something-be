import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/core/base/base.entity';
import { Issue } from 'src/modules/issue/entities/issue.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { ProjectMember } from 'src/modules/project-member/entities/member-project.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { Sprint } from 'src/modules/sprint/entities/sprint.entity';
import { WorkspaceMember } from 'src/modules/workspace-member/entities/workspace-member.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { Entity, Column, Index, OneToMany } from 'typeorm';

@Entity({ name: TABLE_NAME.USER })
export class User extends BaseEntity {
  @ApiProperty({ example: 'john' })
  @Column({ length: 250, nullable: false })
  name: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @Column({ length: 250, unique: true, nullable: false })
  @Index({ unique: true })
  email: string;

  @Exclude()
  @Column({ length: 250, nullable: false })
  password: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @Column({ length: 250, nullable: true })
  avatar?: string;

  @Exclude()
  @Column({ default: false })
  verified: boolean;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  refresh_token?: string;

  @OneToMany(() => WorkspaceMember, (member) => member.user)
  workspaceMemberships: WorkspaceMember[];

  @OneToMany(() => ProjectMember, (member) => member.user)
  projectMemberships: ProjectMember[];

  @OneToMany(() => Sprint, (sprint) => sprint.user)
  sprints: Sprint[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Issue, (issue) => issue.reporter)
  reports: Issue[];

  @OneToMany(() => Issue, (issue) => issue.assignee)
  assignees: Issue[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
