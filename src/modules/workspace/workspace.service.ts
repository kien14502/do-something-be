import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { WorkspaceRepository } from './workspace.repository';
import { Workspace } from './entities/workspace.entity';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { WorkspaceMemberService } from '../workspace-member/workspace-member.service';
import {
  ResourceNotFoundException,
  ValidationException,
} from 'src/core/exception/custom.exception';
import { TABLE_NAME } from 'src/shared/enums/database';
import {
  WORKSPACE_ROLE,
  WORKSPACE_STATUS_INVITE,
} from 'src/shared/enums/workspace';
import { GetMemberWorkspaceDto } from './dtos/get-member-workspace.dto';

@Injectable()
export class WorkspaceService extends BaseService<Workspace> {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly memberWorkspaceService: WorkspaceMemberService,
  ) {
    super(workspaceRepository);
  }

  async createWorkspace(payload: CreateWorkspaceDto, user: CurrentUser) {
    try {
      const { members, ...workspaceData } = payload;
      const workspace = this.workspaceRepository.create({
        ...workspaceData,
        ownerId: user.id,
        launched: true,
      });
      await this.unLaunchWorkspace(user.id);
      const savedWorkspace = await workspace.save();

      await this.memberWorkspaceService.createOwner(user.id, savedWorkspace.id);

      if (members && members.length > 0) {
        await this.memberWorkspaceService.createMultiple(
          members,
          savedWorkspace.id,
          user,
        );
      }

      return savedWorkspace;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Create workspace failed');
    }
  }

  async getAllWorkspaces(user: CurrentUser) {
    return this.workspaceRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE)
      .leftJoin(`${TABLE_NAME.WORKSPACE}.members`, 'member')
      .leftJoinAndSelect(`${TABLE_NAME.WORKSPACE}.owner`, 'owner')
      .where('member.userId = :userId', {
        userId: user.id,
      })
      .getMany();
  }

  async getDetailsById(id: string, user: CurrentUser) {
    try {
      const detailWorkspace = await this.workspaceRepository
        .createQueryBuilder(TABLE_NAME.WORKSPACE)
        .leftJoin(`${TABLE_NAME.WORKSPACE}.members`, 'member')
        .leftJoinAndSelect(`${TABLE_NAME.WORKSPACE}.owner`, 'owner')
        .where(`${TABLE_NAME.WORKSPACE}.id = :id`, { id })
        .andWhere('member.userId = :userId', { userId: user.id })
        .getOne();

      if (!detailWorkspace) {
        throw new NotFoundException('Workspace not found');
      }
      const total_member = await this.memberWorkspaceService.count({
        workspaceId: detailWorkspace.id,
        statusInvite: WORKSPACE_STATUS_INVITE.ACCEPTED,
      });

      return {
        ...detailWorkspace,
        total_member,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Get detail workspace failed');
    }
  }

  async getMembersWorkspace(
    id: string,
    params: GetMemberWorkspaceDto,
    user: CurrentUser,
  ) {
    const findWorkspace = await this.getDetailsById(id, user);
    if (!findWorkspace) {
      throw new ValidationException('Workspace not found or access denied');
    }
    const members = await this.memberWorkspaceService.getAllMemberWorkspaceById(
      { id, ...params },
    );
    return members;
  }

  async launchWorkspace(id: string, user: CurrentUser) {
    const workspace = await this.getDetailsById(id, user);
    if (!workspace) {
      throw new ValidationException('Workspace not found or access denied');
    }
    await this.unLaunchWorkspace(user.id);
    const workspaceUpdated = await this.update(workspace.id, {
      launched: true,
    });
    return workspaceUpdated;
  }

  async getLaunchedWorkspace(user: CurrentUser) {
    const workspace = await this.workspaceRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE)
      .leftJoin(`${TABLE_NAME.WORKSPACE}.members`, 'members')
      .leftJoinAndSelect(`${TABLE_NAME.WORKSPACE}.owner`, 'owner')
      .where('members.userId = :userId', {
        userId: user.id,
      })
      .andWhere('tb_workspace.launched = :launched', { launched: true })
      .getOne();
    if (!workspace) {
      throw new ResourceNotFoundException('Workspace');
    }

    const total_member = await this.memberWorkspaceService.count({
      workspaceId: workspace.id,
      statusInvite: WORKSPACE_STATUS_INVITE.ACCEPTED,
    });

    return {
      ...workspace,
      total_member,
    };
  }

  async unLaunchWorkspace(userId: string) {
    const workspaceLaunched = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect('workspace.members', 'member')
      .where('workspace.launched = :launched', { launched: true })
      .andWhere('member.userId = :userId', { userId })
      .getOne();

    if (!workspaceLaunched) {
      return null;
    }

    workspaceLaunched.launched = false;
    const saved = await workspaceLaunched.save();

    return saved;
  }

  async workspaceOwner(
    userId: string,
    workspaceId: string,
  ): Promise<Workspace> {
    const workspace = await this.workspaceRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE)
      .leftJoin('tb_workspace.members', 'member')
      .where('tb_member.userId = :userId', { userId })
      .andWhere('tb_member.role = :role', { role: WORKSPACE_ROLE.OWNER })
      .andWhere('tb_workspace.id = :workspaceId', { workspaceId })
      .getOne();
    if (!workspace) {
      throw new ResourceNotFoundException('Workspace', workspaceId);
    }
    return workspace;
  }
  async inviteMemberWorkspace(
    memberIds: string[],
    workspaceId: string,
    user: CurrentUser,
  ) {
    try {
      const members = await this.memberWorkspaceService.createMultiple(
        memberIds,
        workspaceId,
        user,
      );
      return members;
    } catch (error) {
      console.log(error);
      throw new ResourceNotFoundException('Workspace', workspaceId);
    }
  }
}
