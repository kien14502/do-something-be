import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { ProjectMember } from './entities/member-project.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ProjectMemberRepository extends BaseRepository<ProjectMember> {
  constructor(private dataSource: DataSource) {
    super(ProjectMember, dataSource.createEntityManager());
  }
}
