import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';
import { WorkspaceRoles } from 'src/common/decorators/workspace-role.decorator';
import { WORKSPACE_ROLE } from 'src/shared/enums/workspace';
import { ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { ApiOkResponseCustom } from 'src/common/decorators/api-response.decorator';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { PageResponseDto } from 'src/common/dtos/page-response.dto';
import { GetMemberWorkspaceDto } from './dtos/get-member-workspace.dto';
import { InviteMembersDto } from './dtos/invite-members.dto';
import { User } from '../user/entities/user.entity';

@ApiTags('Workspace')
@ApiGlobalResponses()
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post('')
  async createWorkspace(
    @Body() body: CreateWorkspaceDto,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.createWorkspace(body, user);
  }

  @WorkspaceRoles(WORKSPACE_ROLE.OWNER)
  @Get('/all')
  async getAllWorkspaces(@UserDecorator() user: CurrentUser) {
    return this.workspaceService.getAllWorkspaces(user);
  }

  @Get('/launched')
  async getLaunchedWorkspace(@UserDecorator() user: CurrentUser) {
    return this.workspaceService.getLaunchedWorkspace(user);
  }

  @Get(':id')
  async getWorkspaceById(
    @Param('id') id: string,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.getDetailsById(id, user);
  }

  @Patch(':id/launch')
  async launchWorkspace(
    @Param('id') id: string,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.launchWorkspace(id, user);
  }

  @ApiOkResponseCustom(PageResponseDto<WorkspaceMember>)
  @Get(':id/members')
  async getMembersWorkspace(
    @Param('id') id: string,
    @Query() queries: GetMemberWorkspaceDto,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.getMembersWorkspace(id, queries, user);
  }

  @ApiOkResponseCustom(WorkspaceMember)
  @Post(':id/invite')
  async inviteMember(
    @Param('id') id: string,
    @Body() { ids }: InviteMembersDto,
    @UserDecorator() user: User,
  ) {
    const members = await this.workspaceService.inviteMemberWorkspace(
      ids,
      id,
      user,
    );
    return members;
  }
}
