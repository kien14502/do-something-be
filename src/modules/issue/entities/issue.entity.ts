import { BaseEntity } from 'src/core/base/base.entity';
import { ProjectStatus } from 'src/modules/project-status/entities/project-status.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { SprintIssue } from 'src/modules/sprint-issue/entities/sprint-issue.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { ISSUE_PRIORITY } from 'src/shared/enums/project';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';

@Entity({ name: TABLE_NAME.ISSUE })
@Unique(['projectId', 'issueNumber'])
export class Issue extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: number;

  @Column({ name: 'issue_number' })
  issueNumber: number;

  @Column({ name: 'issue_key', length: 50 })
  issueKey: string;

  @Column({ name: 'issue_type_id', nullable: true })
  issueTypeId: number;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'status_id', nullable: true })
  statusId: number;

  @Column({
    name: 'priority_id',
    nullable: true,
    enum: ISSUE_PRIORITY,
    enumName: 'ISSUE_PRIORITY',
  })
  priority: ISSUE_PRIORITY;

  @Column({ name: 'reporter_id', nullable: true, type: 'uuid' })
  reporterId: number;

  @Column({ name: 'assignee_id', nullable: true })
  assigneeId: number;

  @Column({ name: 'parent_issue_id', nullable: true })
  parentIssueId: number;

  @Column({ name: 'story_points', nullable: true })
  storyPoints: number;

  @Column({
    name: 'estimate_hours',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  estimateHours: number;

  @Column({
    name: 'time_spent_hours',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  timeSpentHours: number;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @ManyToOne(() => Project, (prj) => prj.issues)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @ManyToOne(() => User, (user) => user.assignees)
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @OneToOne(() => SprintIssue, (sprintIssue) => sprintIssue.issue)
  sprintIssue: SprintIssue;

  @ManyToOne(() => ProjectStatus, (status) => status.issues)
  status: ProjectStatus;
}
