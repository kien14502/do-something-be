import { UseGuards, Controller, Sse, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { SseService } from './sse.service';
import type { Request } from 'express';
import { CurrentUser } from 'src/shared/interfaces/user.interface';

@UseGuards(JwtAuthGuard)
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  stream(@Req() req: Request) {
    const user = req.user as CurrentUser;

    const stream$ = this.sseService.connect(user.id);

    req.on('close', () => {
      this.sseService.disconnect(user.id);
    });

    return stream$;
  }
}
