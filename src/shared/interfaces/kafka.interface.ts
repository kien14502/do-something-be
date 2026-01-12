export interface KafkaMessage<T = any> {
  key: string;
  value: T;
  headers?: Record<string, any>;
}

export interface KafkaPayload<T = any> {
  topic: string;
  partition: number;
  message: KafkaMessage<T>;
}
export interface KafkaResponse<T = any> {
  value: T;
}
