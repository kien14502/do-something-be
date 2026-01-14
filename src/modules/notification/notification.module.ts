import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { IssueNotificationHandler } from './handlers/issue.handler';
import { WorkspaceInviteHandler } from './handlers/workspace-invite.handler';
import { SseModule } from 'src/common/services/sse/sse.module';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), SseModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    IssueNotificationHandler,
    WorkspaceInviteHandler,
    NotificationRepository,
  ],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
