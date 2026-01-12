import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './project.repository';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), WorkspaceModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
