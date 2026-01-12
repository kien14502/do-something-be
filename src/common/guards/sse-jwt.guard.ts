import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CurrentUser } from 'src/shared/interfaces/user.interface';

@Injectable()
export class SseJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.query.token as string;

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify<CurrentUser>(token);
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
}
