import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { Request, Response } from 'express';
import { CurrentUser } from 'src/shared/interfaces/user.interface';

@ApiTags('Auth')
@ApiGlobalResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    return await this.authService.login(req.user as CurrentUser, res);
  }
}
