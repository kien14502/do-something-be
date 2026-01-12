import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberRepository } from './workspace-member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceMember])],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService, WorkspaceMemberRepository],
  exports: [WorkspaceMemberService, WorkspaceMemberRepository],
})
export class WorkspaceMemberModule {}
