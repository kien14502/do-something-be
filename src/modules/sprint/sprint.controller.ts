import { Body, Controller, Post } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from './dtos/create-sprint.dto';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Sprint } from './entities/sprint.entity';
import { ApiOkResponseCustom } from 'src/common/decorators/api-response.decorator';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';

@ApiGlobalResponses()
@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post('')
  @ApiOkResponseCustom(Sprint)
  async createSprint(
    @Body() payload: CreateSprintDto,
    @UserDecorator() user: CurrentUser,
  ): Promise<Sprint> {
    return await this.sprintService.createSprint(payload, user);
  }
}
