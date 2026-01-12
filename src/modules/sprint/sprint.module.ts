import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { SprintRepository } from './sprint.repository';
import { ProjectModule } from '../project/project.module';
import { ProjectMemberModule } from '../project-member/project-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sprint]),
    ProjectModule,
    ProjectMemberModule,
  ],
  controllers: [SprintController],
  providers: [SprintService, SprintRepository],
  exports: [SprintService, SprintRepository],
})
export class SprintModule {}
