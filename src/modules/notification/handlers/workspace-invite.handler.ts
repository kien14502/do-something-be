import { Injectable } from '@nestjs/common';
import {
  NotificationType,
  NotificationChannel,
} from 'src/shared/enums/notification';
import { NotificationService } from '../notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { WORKSPACE_EVENT } from 'src/shared/enums/event-emitter';

@Injectable()
export class WorkspaceInviteHandler {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(WORKSPACE_EVENT.INVITED)
  async handleWorkspaceInvite(event: {
    workspaceId: string;
    userId: string;
    role: string;
  }) {
    await this.notificationService.send({
      userId: event.userId,
      type: NotificationType.WORKSPACE_INVITE,
      payload: event,
      channels: [NotificationChannel.SSE],
    });
  }
}
