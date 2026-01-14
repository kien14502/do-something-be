import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAllNotification(@UserDecorator() user: CurrentUser) {
    return await this.notificationService.getAllNotifications(user);
  }
}
