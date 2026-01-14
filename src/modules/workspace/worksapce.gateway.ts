import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GatewaySessionManager } from 'src/common/services/gateway/gateway.session';
import { gatewayConfig } from 'src/config/gateway.config';
import { UserService } from '../user/user.service';
import { Server } from 'socket.io';
import type { AuthenticatedSocket } from 'src/shared/interfaces/gateway.interface';
import { Logger } from '@nestjs/common';
import { UserSocket } from 'src/common/decorators/user-socket.decorator';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';

@WebSocketGateway(80, gatewayConfig)
export class WorkspaceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WorkspaceGateway.name);

  constructor(
    private readonly session: GatewaySessionManager,
    private readonly userService: UserService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Server init', server);
  }

  handleConnection(socket: AuthenticatedSocket) {
    try {
      this.session.setUserSocket(socket.user?.id ?? '', socket);
      this.logger.debug(`Client connected: ${socket.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Connection error: ${errorMessage}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      socket.disconnect(true);
    }
  }

  handleDisconnect(@UserSocket() user: CurrentUser) {
    try {
      this.session.removeUserSocket(user.id);
      this.logger.debug(`Client disconnected: ${user.id}`);
    } catch (error) {
      this.logger.error(`Disconnection error: ${error}`);
    }
  }
}
