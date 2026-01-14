import { Module } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';
import { ProjectStatusController } from './project-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectStatus } from './entities/project-status.entity';
import { ProjectStatusRepository } from './project-status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectStatus])],
  controllers: [ProjectStatusController],
  providers: [ProjectStatusService, ProjectStatusRepository],
  exports: [ProjectStatusService, ProjectStatusRepository],
})
export class ProjectStatusModule {}
