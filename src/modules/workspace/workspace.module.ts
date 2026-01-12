import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserModule } from '../user/user.module';
import { WorkspaceMemberModule } from '../workspace-member/workspace-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    UserModule,
    WorkspaceMemberModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
