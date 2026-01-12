import { Module } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberController } from './project-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from './entities/member-project.entity';
import { ProjectMemberRepository } from './project-member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember])],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService, ProjectMemberRepository],
  exports: [ProjectMemberService, ProjectMemberRepository],
})
export class ProjectMemberModule {}
