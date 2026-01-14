import { Body, Controller, Post } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';
import { CreateStatusDto } from './dtos/create-status.dto';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';

@ApiGlobalResponses()
@Controller('project-status')
export class ProjectStatusController {
  constructor(private readonly projectStatusService: ProjectStatusService) {}

  @Post('')
  createStatus(@Body() payload: CreateStatusDto) {
    const newStatus = this.projectStatusService.create({
      ...payload,
    });
    return newStatus;
  }
}
