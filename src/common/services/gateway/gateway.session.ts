import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from 'src/shared/interfaces/gateway.interface';

@Injectable()
export class GatewaySessionManager implements GatewaySessionManager {
  private readonly sessions: Map<string, AuthenticatedSocket> = new Map();

  getUserSocket(id: string) {
    return this.sessions.get(String(id));
  }

  setUserSocket(userId: string, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket);
  }
  removeUserSocket(userId: string) {
    this.sessions.delete(userId);
  }
  getSockets(): Map<string, AuthenticatedSocket> {
    return this.sessions;
  }
}
