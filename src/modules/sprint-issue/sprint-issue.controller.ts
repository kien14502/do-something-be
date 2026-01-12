import { Controller } from '@nestjs/common';
import { SprintIssueService } from './sprint-issue.service';

@Controller('sprint-issue')
export class SprintIssueController {
  constructor(private readonly sprintIssueService: SprintIssueService) {}
}
