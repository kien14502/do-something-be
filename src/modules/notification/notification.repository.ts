import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { Notification } from './entities/notification.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(private readonly dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }
}
