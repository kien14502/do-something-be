import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { ProjectStatus } from './entities/project-status.entity';
import { ProjectStatusRepository } from './project-status.repository';

@Injectable()
export class ProjectStatusService extends BaseService<ProjectStatus> {
  constructor(
    private readonly projectStatusRepository: ProjectStatusRepository,
  ) {
    super(projectStatusRepository);
  }
}
