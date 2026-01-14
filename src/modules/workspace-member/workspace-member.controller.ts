import { Controller, Post } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('workspace-member')
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Public()
  @Post('')
  inviteMember() {
    this.workspaceMemberService.inviteMember();
  }
}
