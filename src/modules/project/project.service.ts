import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './project.repository';
import {
  ResourceNotFoundException,
  ValidationException,
} from 'src/core/exception/custom.exception';
import { WorkspaceService } from '../workspace/workspace.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CurrentUser } from 'src/shared/interfaces/user.interface';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(
    private projectRepository: ProjectRepository,
    private workspaceService: WorkspaceService,
  ) {
    super(projectRepository);
  }
  async isExistProject(project_id: string) {
    const project = await this.findOne(project_id);
    if (!project) {
      throw new ResourceNotFoundException('Project', project_id);
    }
    return project;
  }

  async createProject(
    payload: CreateProjectDto,
    user: CurrentUser,
  ): Promise<Project> {
    const workspaceOwner = await this.workspaceService.workspaceOwner(
      user.id,
      payload.workspaceId,
    );

    const newProject = await this.create({
      name: payload.name,
      description: payload.description,
      createBy: user.id,
      workspaceId: workspaceOwner.id,
    });

    if (!newProject) {
      throw new ValidationException('Create project failed');
    }

    return newProject;
  }
}
