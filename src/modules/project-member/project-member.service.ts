import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { ProjectMember } from './entities/member-project.entity';
import { ProjectMemberRepository } from './project-member.repository';
import { ForbiddenAccessException } from 'src/core/exception/custom.exception';

@Injectable()
export class ProjectMemberService extends BaseService<ProjectMember> {
  constructor(private projectMemberRepository: ProjectMemberRepository) {
    super(projectMemberRepository);
  }

  async isExistedMemberProject(
    userId: string,
    projectId: string,
  ): Promise<ProjectMember> {
    const member = await this.findOneBy({ userId, projectId });

    if (!member) {
      throw new ForbiddenAccessException('User not exist in project');
    }

    return member;
  }
}
