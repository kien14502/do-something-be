import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { GetAllDto } from './dtos/get-all.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PageResponseDto } from 'src/common/dtos/page-response.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { User } from '../user/entities/user.entity';

@ApiGlobalResponses()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOkResponse({
    type: ApiResponseDto<PageResponseDto<Notification>>,
  })
  @Get()
  async getAllNotification(
    @Query() queries: GetAllDto,
    @UserDecorator() user: CurrentUser,
  ) {
    return await this.notificationService.getAllNotifications(queries, user);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@UserDecorator() user: User) {
    return this.notificationService.markAllAsRead(user);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  async readNotification(@Param('id') id: string, @UserDecorator() user: User) {
    return this.notificationService.readNotification(id, user);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
