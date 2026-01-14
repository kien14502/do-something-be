import { Injectable } from '@nestjs/common';
import {
  NotificationType,
  NotificationChannel,
} from 'src/shared/enums/notification';
import { NotificationService } from '../notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { WORKSPACE_EVENT } from 'src/shared/enums/event-emitter';
import { SseService } from 'src/common/services/sse/sse.service';

@Injectable()
export class WorkspaceInviteHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly sseService: SseService,
  ) {}

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

    this.sseService.emit('', {
      data: '123',
      type: NotificationType.WORKSPACE_INVITE,
    });
  }
}
