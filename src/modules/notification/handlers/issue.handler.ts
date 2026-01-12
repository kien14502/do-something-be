import { Injectable } from '@nestjs/common';
import {
  NotificationType,
  NotificationChannel,
} from 'src/shared/enums/notification';
import { NotificationService } from '../notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ISSUE_EVENT } from 'src/shared/enums/event-emitter';

@Injectable()
export class IssueNotificationHandler {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(ISSUE_EVENT.ASSIGNED)
  async handleIssueAssigned(event: { issueId: string; assigneeId: string }) {
    await this.notificationService.send({
      userId: event.assigneeId,
      type: NotificationType.ISSUE_ASSIGNED,
      payload: event,
      channels: [NotificationChannel.SSE],
    });
  }
}
