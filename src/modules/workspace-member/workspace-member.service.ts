import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceMemberRepository } from './workspace-member.repository';
import {
  WORKSPACE_ROLE,
  WORKSPACE_STATUS_INVITE,
} from 'src/shared/enums/workspace';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { WORKSPACE_EVENT } from 'src/shared/enums/event-emitter';
import { TABLE_NAME } from 'src/shared/enums/database';

@Injectable()
export class WorkspaceMemberService extends BaseService<WorkspaceMember> {
  constructor(
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(workspaceMemberRepository);
  }

  async createMultiple(ids: string[], workspaceId: string) {
    const memberInstances = this.workspaceMemberRepository.create(
      ids.map((id) => ({
        userId: id,
        workspaceId,
      })),
    );

    const savedMembers =
      await this.workspaceMemberRepository.save(memberInstances);

    this.eventEmitter.emit(WORKSPACE_EVENT.INVITED, {
      workspaceId,
      userIds: ids,
    });

    return savedMembers;
  }

  async createOwner(memberId: string, workspaceId: string) {
    const member = this.workspaceMemberRepository.create({
      userId: memberId,
      workspaceId,
      statusInvite: WORKSPACE_STATUS_INVITE.ACCEPTED,
      role: WORKSPACE_ROLE.OWNER,
    });
    return member.save();
  }

  async getAllMemberWorkspaceById(wsId: string) {
    const members = await this.workspaceMemberRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE_MEMBER)
      .leftJoinAndSelect(`${TABLE_NAME.WORKSPACE_MEMBER}.user`, 'user')
      .select([
        `${TABLE_NAME.WORKSPACE_MEMBER}.id`,
        `${TABLE_NAME.WORKSPACE_MEMBER}.workspaceId`,
        `${TABLE_NAME.WORKSPACE_MEMBER}.userId`,
        `${TABLE_NAME.WORKSPACE_MEMBER}.role`,
        `${TABLE_NAME.WORKSPACE_MEMBER}.statusInvite`,
        `${TABLE_NAME.WORKSPACE_MEMBER}.createdAt`,
        `${TABLE_NAME.WORKSPACE_MEMBER}.updatedAt`,
        'user.id',
        'user.email',
        'user.name',
        'user.avatar',
      ])
      .where(`${TABLE_NAME.WORKSPACE_MEMBER}.workspaceId = :wsId`, { wsId })
      .getMany();

    return members;
  }

  inviteMember() {
    this.eventEmitter.emit(WORKSPACE_EVENT.INVITED, {
      userId: 'dd7fa4c0-5856-4bb7-9818-c42e16099291',
    });
  }
}
