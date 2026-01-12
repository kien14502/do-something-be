import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationChannel } from 'src/shared/enums/notification';
import { Repository } from 'typeorm';
import { SseService } from './sse/sse.service';
import { Notification } from './entities/notification.entity';
import { SendEventDto } from './dtos/send-event.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    private readonly sseService: SseService,
  ) {}

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
}
