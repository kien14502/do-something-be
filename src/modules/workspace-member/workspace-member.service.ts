import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceMemberRepository } from './workspace-member.repository';
import {
  WORKSPACE_ROLE,
  WORKSPACE_STATUS_INVITE,
} from 'src/shared/enums/workspace';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { TABLE_NAME } from 'src/shared/enums/database';
import { PaginationHelper } from 'src/shared/helpers/pagination.helper';
import { PageResponseDto } from 'src/common/dtos/page-response.dto';
import { GetMemberWorkspaceDto } from '../workspace/dtos/get-member-workspace.dto';
import { DataSource } from 'typeorm';
import { Notification } from '../notification/entities/notification.entity';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import { NotificationType } from 'src/shared/enums/notification';
import { WORKSPACE_EVENT } from 'src/shared/enums/event-emitter';

@Injectable()
export class WorkspaceMemberService extends BaseService<WorkspaceMember> {
  constructor(
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {
    super(workspaceMemberRepository);
  }

  async createMultiple(ids: string[], workspaceId: string, user: CurrentUser) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // TODO - use kafka handle this
    try {
      for (const id of ids) {
        await queryRunner.manager.save(WorkspaceMember, {
          role: WORKSPACE_ROLE.MEMBER,
          userId: id,
          workspaceId: workspaceId,
          statusInvite: WORKSPACE_STATUS_INVITE.PENDING,
          inviteById: user.id,
        });

        const notification = await queryRunner.manager.save(Notification, {
          userId: id,
          actorId: user.id,
          type: NotificationType.WORKSPACE_INVITE,
          payload: { workspaceId },
        });

        this.eventEmitter.emit(WORKSPACE_EVENT.INVITED, notification);
      }
      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createOwner(memberId: string, workspaceId: string) {
    const member = this.workspaceMemberRepository.create({
      userId: memberId,
      workspaceId,
      statusInvite: WORKSPACE_STATUS_INVITE.ACCEPTED,
      role: WORKSPACE_ROLE.OWNER,
      inviteById: memberId,
    });
    return member.save();
  }

  async getAllMemberWorkspaceById({
    id,
    limit = 10,
    page = 1,
    email,
    statusInvite,
    role,
    name,
  }: { id: string } & GetMemberWorkspaceDto): Promise<
    PageResponseDto<WorkspaceMember>
  > {
    const skip = PaginationHelper.calculateSkip(page, limit);

    const queryBuilder = this.workspaceMemberRepository
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
      .where(`${TABLE_NAME.WORKSPACE_MEMBER}.workspaceId = :id`, { id })
      .orderBy(`${TABLE_NAME.WORKSPACE_MEMBER}.createdAt`, 'DESC');

    if (email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (statusInvite) {
      queryBuilder.andWhere(
        `${TABLE_NAME.WORKSPACE_MEMBER}.statusInvite = :status`,
        { status: statusInvite },
      );
    }

    if (role) {
      queryBuilder.andWhere(`${TABLE_NAME.WORKSPACE_MEMBER}.role = :role`, {
        role: role,
      });
    }

    if (name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: name,
      });
    }

    const [members, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return PaginationHelper.buildPageResponse(members, total, page, limit);
  }
}
