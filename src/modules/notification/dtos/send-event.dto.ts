import { BasePayload } from 'src/common/dtos/common.dto';
import {
  NotificationChannel,
  NotificationType,
} from 'src/shared/enums/notification';

export class SendEventDto {
  userId: string;
  type: NotificationType;
  payload: BasePayload;
  channels: NotificationChannel[];
}
