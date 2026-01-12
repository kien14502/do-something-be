import { SetMetadata } from '@nestjs/common';
import { WORKSPACE_ROLE } from 'src/shared/enums/workspace';

export const WORKSPACE_ROLES_KEY = 'workspace-roles';
export const WorkspaceRoles = (...roles: WORKSPACE_ROLE[]) =>
  SetMetadata(WORKSPACE_ROLES_KEY, roles);
