import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { Issue } from './entities/issue.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class IssueRepository extends BaseRepository<Issue> {
  constructor(private readonly dataSource: DataSource) {
    super(Issue, dataSource.createEntityManager());
  }
}
