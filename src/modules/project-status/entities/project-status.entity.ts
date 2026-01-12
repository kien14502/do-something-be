import { BaseEntity } from 'src/core/base/base.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity(TABLE_NAME.PROJECT_STATUS)
export class ProjectStatus extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 7 })
  color: string;

  @Column({ type: 'varchar', length: 7 })
  position: number;

  @ManyToOne(() => Project, (project) => project.statuses)
  project: Project;
}
