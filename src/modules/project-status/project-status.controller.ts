import { Controller } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';

@Controller('project-status')
export class ProjectStatusController {
  constructor(private readonly projectStatusService: ProjectStatusService) {}
}
