import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';
import { WorkspaceRoles } from 'src/common/decorators/workspace-role.decorator';
import { WORKSPACE_ROLE } from 'src/shared/enums/workspace';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('workspace')
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

  @Post('/launch')
  async launchWorkspace(
    @Body('id') id: string,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.launchWorkspace(id, user);
  }

  @Get(':id')
  async getWorkspaceById(
    @Param('id') id: string,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.getDetailsById(id, user);
  }

  @Get(':id/members')
  async getMembersWorkspace(
    @Param('id') id: string,
    @UserDecorator() user: CurrentUser,
  ) {
    return this.workspaceService.getMembersWorkspace(id, user);
  }
}
