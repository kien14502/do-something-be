import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { Issue } from './entities/issue.entity';
import { IssueRepository } from './issue.repository';

@Injectable()
export class IssueService extends BaseService<Issue> {
  constructor(private readonly issueRepository: IssueRepository) {
    super(issueRepository);
  }
}
