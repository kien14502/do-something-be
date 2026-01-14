import { Controller, Req, Sse, UseGuards } from '@nestjs/common';
import { SseService } from './sse.service';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SseJwtGuard } from 'src/common/guards/sse-jwt.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Notification')
@UseGuards(SseJwtGuard)
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}
  @Sse()
  @Public()
  stream(@Req() req: Request) {
    const user = req.user as CurrentUser;

    const stream$ = this.sseService.connect(user.id);

    req.on('close', () => {
      this.sseService.disconnect(user.id);
    });

    return stream$;
  }
}
