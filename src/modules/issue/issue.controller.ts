import { Controller } from '@nestjs/common';
import { IssueService } from './issue.service';

@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}
}
