import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MailersService } from './mailers.service';
import { ETopicKafka } from 'src/shared/enums/kafka';

@Controller()
export class EmailConsumerController {
  private readonly logger = new Logger(EmailConsumerController.name);
  constructor(private readonly mailerService: MailersService) {}

  @MessagePattern(ETopicKafka.REGISTER_ACCOUNT)
  async handleEmailVerify(
    @Payload() message: { email: string; token: string },
  ) {
    const { email, token } = message;
    await this.mailerService.sendEmailRegister(email, token);
    return { success: true, message: 'Email sent successfully' };
  }
}
