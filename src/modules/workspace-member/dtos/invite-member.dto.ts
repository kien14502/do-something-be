import { User } from 'src/modules/user/entities/user.entity';
import { Workspace } from 'src/modules/workspace/entities/workspace.entity';

export class InviteMemberDto {
  from: User;
  to: User;
  workspace: Workspace;
}
