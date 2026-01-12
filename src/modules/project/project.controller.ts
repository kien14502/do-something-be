import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';
import { ValidationException } from 'src/core/exception/custom.exception';
import { Project } from './entities/project.entity';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { ApiOkResponseCustom } from 'src/common/decorators/api-response.decorator';

@ApiGlobalResponses()
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @ApiOkResponseCustom(Project)
  async createProject(
    @Body() payload: CreateProjectDto,
    @UserDecorator() user: CurrentUser,
  ): Promise<Project> {
    try {
      const newProject = await this.projectService.createProject(payload, user);
      return newProject;
    } catch (error) {
      console.error(error);
      throw new ValidationException('Create project failed');
    }
  }
}
