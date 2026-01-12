import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/base/base.entity';
import { Issue } from 'src/modules/issue/entities/issue.entity';
import { ProjectMember } from 'src/modules/project-member/entities/member-project.entity';
import { ProjectStatus } from 'src/modules/project-status/entities/project-status.entity';
import { Sprint } from 'src/modules/sprint/entities/sprint.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Workspace } from 'src/modules/workspace/entities/workspace.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: TABLE_NAME.PROJECT })
export class Project extends BaseEntity {
  @ApiProperty({ example: 'My New Project' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 'This is a description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 'uuid-workspace-123' })
  @Column({ type: 'uuid', name: 'workspace_id' })
  workspaceId: string;

  @ApiProperty()
  @Column({ name: 'create_by' })
  createBy: string;

  @OneToMany(() => ProjectMember, (member) => member.project, {
    onDelete: 'CASCADE',
  })
  members: ProjectMember[];

  @ManyToOne(() => Workspace, (workspace) => workspace.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints: Sprint[];

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[];

  @OneToMany(() => ProjectStatus, (prjStatus) => prjStatus.project)
  statuses: ProjectStatus[];
}
