import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceMemberRepository } from './workspace-member.repository';
import { WORKSPACE_ROLE } from 'src/shared/enums/workspace';
import { TABLE_NAME } from 'src/shared/enums/database';

@Injectable()
export class WorkspaceMemberService extends BaseService<WorkspaceMember> {
  constructor(
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
  ) {
    super(workspaceMemberRepository);
  }

  async createMultiple(ids: string[], workspaceId: string) {
    const memberInstances = this.workspaceMemberRepository.create(
      ids.map((id) => ({
        userId: id,
        workspaceId: workspaceId,
      })),
    );

    return await this.workspaceMemberRepository.save(memberInstances);
  }

  async createOwner(memberId: string, workspaceId: string) {
    const member = this.workspaceMemberRepository.create({
      userId: memberId,
      workspaceId,
    });
    member.role = WORKSPACE_ROLE.OWNER;
    return member.save();
  }

  async getAllMemberWorkspaceById(wsId: string) {
    const members = await this.workspaceMemberRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE_MEMBER)
      .where('workspace_members.workspace = :wsId', { wsId })
      .getMany();

    return members;
  }
}
