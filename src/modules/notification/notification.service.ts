import { Injectable } from '@nestjs/common';
import { NotificationChannel } from 'src/shared/enums/notification';
import { Notification } from './entities/notification.entity';
import { SendEventDto } from './dtos/send-event.dto';
import { SseService } from 'src/common/services/sse/sse.service';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import { BaseService } from 'src/core/base/base.service';
import { NotificationRepository } from './notification.repository';
import { TABLE_NAME } from 'src/shared/enums/database';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly sseService: SseService,
  ) {
    super(repo);
  }

  async send(options: SendEventDto) {
    const notification = await this.repo.save({
      userId: options.userId,
      type: options.type,
      payload: options.payload,
    });

    if (options.channels.includes(NotificationChannel.SSE)) {
      this.sseService.emit(options.userId, {
        type: options.type,
        data: notification,
      });
    }
  }

  async getAllNotifications(user: CurrentUser): Promise<Notification[]> {
    const notifications = await this.repo
      .createQueryBuilder(TABLE_NAME.NOTIFICATION)
      .where(`${TABLE_NAME.NOTIFICATION}.userId = :userId`, {
        userId: user.id,
      })
      .getMany();
    return notifications;
  }
}
