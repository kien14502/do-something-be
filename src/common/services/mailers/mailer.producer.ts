import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { ETopicKafka } from 'src/shared/enums/kafka';

@Injectable()
export class EmailProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private kafka: Kafka;
  private producer: Producer;

  constructor(configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'mail-service',
      brokers: [
        configService.getOrThrow<string>('BROKER_KAFKA', 'kafka:29092'),
      ],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async sendVerificationEmail(data: { email: string; token: string }) {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: ETopicKafka.REGISTER_ACCOUNT,
        messages: [{ value: JSON.stringify(data) }],
      });
    } catch (error) {
      console.error(error);
    }
  }
}
