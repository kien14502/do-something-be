import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { IssueNotificationHandler } from './handlers/issue.handler';
import { WorkspaceInviteHandler } from './handlers/workspace-invite.handler';
import { SseService } from './sse/sse.service';
import { SseController } from './sse/sse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [SseController, NotificationController],
  providers: [
    NotificationService,
    SseService,
    IssueNotificationHandler,
    WorkspaceInviteHandler,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
