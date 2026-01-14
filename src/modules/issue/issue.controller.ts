import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { UpdateIssueDto } from './dtos/update-issue.dto';

@ApiGlobalResponses()
@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get('')
  getAll() {}

  @Post('')
  createIssue(@Body() payload: CreateIssueDto) {}

  @Patch('/move/:id')
  moveIssue() {}

  @Patch(':id')
  updateIssue(@Body() payload: UpdateIssueDto) {}

  @Get(':id')
  getDetail(@Param('id') id: string) {}

  @Delete(':id')
  deleteIssue(@Param('id') id: string) {}
}
