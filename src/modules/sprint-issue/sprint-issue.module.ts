import { Module } from '@nestjs/common';
import { SprintIssueService } from './sprint-issue.service';
import { SprintIssueController } from './sprint-issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintIssue } from './entities/sprint-issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SprintIssue])],
  controllers: [SprintIssueController],
  providers: [SprintIssueService],
})
export class SprintIssueModule {}
