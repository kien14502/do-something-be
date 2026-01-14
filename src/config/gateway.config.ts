import { GatewayMetadata } from '@nestjs/websockets';

export const gatewayConfig: GatewayMetadata = {
  cors: {
    origin: true,
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
  namespace: 'events',
};
