import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { Project } from './entities/project.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }
}
