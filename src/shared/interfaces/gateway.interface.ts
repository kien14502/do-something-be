import { CurrentUser } from './user.interface';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: CurrentUser;
}

export interface GatewaySessionManager {
  getUserSocket(id: string): AuthenticatedSocket;
  setUserSocket(id: string, socket: AuthenticatedSocket): void;
  removeUserSocket(id: string): void;
  getSockets(): Map<string, AuthenticatedSocket>;
}

export interface GroupGateway {
  groupId: string;
}
