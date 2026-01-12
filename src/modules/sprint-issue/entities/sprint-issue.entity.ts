import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/base/base.entity';
import { Issue } from 'src/modules/issue/entities/issue.entity';
import { Sprint } from 'src/modules/sprint/entities/sprint.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: TABLE_NAME.SPRINT_ISSUE })
@Index(['sprintId', 'issueId'], { unique: true })
export class SprintIssue extends BaseEntity {
  @ApiProperty({ example: 'uuid-sprint-123' })
  @Column({ name: 'sprint_id', type: 'uuid' })
  sprintId: string;

  @ApiProperty({ example: 'uuid-issue-456' })
  @Column({ name: 'issue_id', type: 'uuid' })
  issueId: string;

  @ApiProperty({ example: '2026-01-10T10:30:00Z' })
  @CreateDateColumn({ name: 'added_at', type: 'timestamp' })
  addedAt: Date;

  @ApiProperty({ required: false })
  @Column({ name: 'removed_at', type: 'timestamp', nullable: true })
  removedAt?: Date;

  // Relations
  @ManyToOne(() => Sprint, (sprint) => sprint.sprintIssues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sprint_id' })
  sprint: Sprint;

  @OneToOne(() => Issue, (issue) => issue.sprintIssue, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;
}
