import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/base/base.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { SprintIssue } from 'src/modules/sprint-issue/entities/sprint-issue.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { SPRINT_STATUS } from 'src/shared/enums/sprint';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: TABLE_NAME.SPRINT })
export class Sprint extends BaseEntity {
  @ApiProperty({ example: 'uuid-project-123' })
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ApiProperty({ example: 'Sprint 1' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 'Complete user authentication module' })
  @Column({ type: 'text', nullable: true })
  goal: string;

  @ApiProperty({ example: '2026-01-10' })
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @ApiProperty({ example: '2026-01-24' })
  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @ApiProperty({ example: 'uuid-user-123' })
  @Column({ name: 'create_by_id', type: 'uuid' })
  createById: string;

  @ApiProperty({ example: 'PLANNED', enum: SPRINT_STATUS })
  @Column({
    type: 'enum',
    enum: SPRINT_STATUS,
    default: SPRINT_STATUS.PLANNED,
  })
  status: SPRINT_STATUS;

  @ManyToOne(() => Project, (prj) => prj.sprints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.sprints)
  @JoinColumn({ name: 'create_by_id' })
  user: User;

  @OneToMany(() => SprintIssue, (sprintIssues) => sprintIssues.sprint)
  sprintIssues: SprintIssue[];
}
