import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { ProjectStatus } from './entities/project-status.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ProjectStatusRepository extends BaseRepository<ProjectStatus> {
  constructor(private readonly dataSource: DataSource) {
    super(ProjectStatus, dataSource.createEntityManager());
  }
}
