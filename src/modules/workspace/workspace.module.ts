import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserModule } from '../user/user.module';
import { WorkspaceMemberModule } from '../workspace-member/workspace-member.module';
import { WorkspaceGateway } from './worksapce.gateway';
import { GatewaySessionManager } from 'src/common/services/gateway/gateway.session';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    UserModule,
    WorkspaceMemberModule,
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceRepository,
    WorkspaceGateway,
    GatewaySessionManager,
  ],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
