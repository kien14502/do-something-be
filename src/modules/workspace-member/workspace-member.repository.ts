import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class WorkspaceMemberRepository extends BaseRepository<WorkspaceMember> {
  constructor(private readonly dataSource: DataSource) {
    super(WorkspaceMember, dataSource.createEntityManager());
  }
}
