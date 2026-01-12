import { Module } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';
import { ProjectStatusController } from './project-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectStatus } from './entities/project-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectStatus])],
  controllers: [ProjectStatusController],
  providers: [ProjectStatusService],
})
export class ProjectStatusModule {}
