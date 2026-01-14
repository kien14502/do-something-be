import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { IssueRepository } from './issue.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  controllers: [IssueController],
  providers: [IssueService, IssueRepository],
  exports: [IssueService, IssueRepository],
})
export class IssueModule {}
