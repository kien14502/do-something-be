import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { Sprint } from './entities/sprint.entity';
import { SprintRepository } from './sprint.repository';
import { CreateSprintDto } from './dtos/create-sprint.dto';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import { ProjectMemberService } from '../project-member/project-member.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class SprintService extends BaseService<Sprint> {
  constructor(
    private sprintRepository: SprintRepository,
    private projectMemberService: ProjectMemberService,
    private projectService: ProjectService,
  ) {
    super(sprintRepository);
  }
  async createSprint(
    payload: CreateSprintDto,
    user: CurrentUser,
  ): Promise<Sprint> {
    const existedProject = await this.projectService.isExistProject(
      payload.projectId,
    );
    const createBy = await this.projectMemberService.isExistedMemberProject(
      user.id,
      existedProject.id,
    );
    return await this.create({
      ...payload,
      createById: createBy.id,
    });
  }
}
