import { Injectable } from '@nestjs/common';
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
import { WORKSPACE_ROLE } from 'src/shared/enums/workspace';

@Injectable()
export class WorkspaceService extends BaseService<Workspace> {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly memberWorkspaceService: WorkspaceMemberService,
  ) {
    super(workspaceRepository);
  }

  async createWorkspace(payload: CreateWorkspaceDto, user: CurrentUser) {
    const { members, ...workspaceData } = payload;
    const workspace = this.workspaceRepository.create({
      ...workspaceData,
      launched: true,
    });
    await this.unLaunchWorkspace();
    const savedWorkspace = await workspace.save();

    await this.memberWorkspaceService.createOwner(user.id, savedWorkspace.id);

    if (members && members.length > 0) {
      await this.memberWorkspaceService.createMultiple(
        members,
        savedWorkspace.id,
      );
    }

    return savedWorkspace;
  }

  async getAllWorkspaces(user: CurrentUser) {
    return this.workspaceRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE)
      .leftJoin('workspace.members', 'member')
      .where('member.userId = :userId', {
        userId: user.id,
      })
      .getMany();
  }

  async getDetailsById(id: string, user: CurrentUser) {
    return (
      this.workspaceRepository
        .createQueryBuilder(TABLE_NAME.WORKSPACE)
        // .leftJoinAndSelect('workspace.members', 'all_members')
        .leftJoin('workspace.members', 'member')
        .where('workspace.id = :id', { id })
        .andWhere('member.userId = :userId', { userId: user.id })
        .getOne()
    );
  }

  async getMembersWorkspace(id: string, user: CurrentUser) {
    const findWorkspace = await this.getDetailsById(id, user);
    if (!findWorkspace) {
      throw new ValidationException('Workspace not found or access denied');
    }
    const members = await this.memberWorkspaceService.getAllMemberWorkspaceById(
      findWorkspace.id,
    );
    return members;
  }

  async launchWorkspace(id: string, user: CurrentUser) {
    const workspace = await this.getDetailsById(id, user);
    if (!workspace) {
      throw new ValidationException('Workspace not found or access denied');
    }
    workspace.launched = true;
    return await workspace.save();
  }

  async getLaunchedWorkspace(user: CurrentUser) {
    return this.workspaceRepository
      .createQueryBuilder(TABLE_NAME.WORKSPACE)
      .leftJoin('workspace.members', 'members')
      .where('members.userId = :userId', {
        userId: user.id,
      })
      .andWhere('workspace.launched = :launched', { launched: true })
      .getOne();
  }

  async unLaunchWorkspace() {
    const workspaceLaunched = await this.workspaceRepository.findOneBy({
      launched: true,
    });

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
      .leftJoin('workspace.members', 'member')
      .where('member.userId = :userId', { userId })
      .andWhere('member.role = :role', { role: WORKSPACE_ROLE.OWNER })
      .andWhere('workspace.id = :workspaceId', { workspaceId })
      .getOne();
    if (!workspace) {
      throw new ResourceNotFoundException('Workspace', workspaceId);
    }
    return workspace;
  }
}
