import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationChannel } from 'src/shared/enums/notification';
import { Notification } from './entities/notification.entity';
import { SendEventDto } from './dtos/send-event.dto';
import { SseService } from 'src/common/services/sse/sse.service';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import { BaseService } from 'src/core/base/base.service';
import { NotificationRepository } from './notification.repository';
import { TABLE_NAME } from 'src/shared/enums/database';
import { GetAllDto } from './dtos/get-all.dto';
import { PaginationHelper } from 'src/shared/helpers/pagination.helper';
import { PageResponseDto } from 'src/common/dtos/page-response.dto';
import { ForbiddenAccessException } from 'src/core/exception/custom.exception';

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

  async getAllNotifications(
    { isRead, limit = 10, page = 1 }: GetAllDto,
    user: CurrentUser,
  ): Promise<PageResponseDto<Notification>> {
    const skip = PaginationHelper.calculateSkip(page, limit);
    const queryBuilder = this.repo
      .createQueryBuilder(TABLE_NAME.NOTIFICATION)
      .leftJoinAndSelect(`${TABLE_NAME.NOTIFICATION}.user`, 'user')
      .leftJoinAndSelect(`${TABLE_NAME.NOTIFICATION}.actor`, 'actor')
      .where(`${TABLE_NAME.NOTIFICATION}.userId = :userId`, {
        userId: user.id,
      })
      .orderBy(`${TABLE_NAME.NOTIFICATION}.createdAt`, 'DESC');

    if (isRead) {
      queryBuilder.andWhere(`${TABLE_NAME.NOTIFICATION}.isRead = :isRead`, {
        isRead,
      });
    }

    const [notifications, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return PaginationHelper.buildPageResponse(
      notifications,
      total,
      page,
      limit,
    );
  }

  async readNotification(id: string, user: CurrentUser) {
    const result = await this.repo.update(
      {
        id,
        userId: user.id,
        isRead: false,
      },
      {
        isRead: true,
        updatedAt: new Date(),
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Notification not found or already read');
    }

    return {
      message: 'Notification marked as read',
    };
  }

  async markAllAsRead(user: CurrentUser) {
    const result = await this.repo.update(
      {
        userId: user.id,
        isRead: false,
      },
      {
        isRead: true,
        updatedAt: new Date(),
      },
    );

    return {
      message: `Marked ${result.affected || 0} notifications as read`,
      affected: result.affected || 0,
    };
  }

  async verifyUserNotification(id: string, user: CurrentUser) {
    const notification = await this.repo
      .createQueryBuilder(TABLE_NAME.NOTIFICATION)
      .leftJoin(`${TABLE_NAME.NOTIFICATION}.user`, 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere(`${TABLE_NAME.NOTIFICATION}.id = :id`, { id })
      .getOne();
    if (!notification) {
      throw new ForbiddenAccessException('Access is denied!!!');
    }
    return notification;
  }
}
