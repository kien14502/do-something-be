import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { Request, Response } from 'express';
import type { CurrentUser } from 'src/shared/interfaces/user.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { User } from '../user/entities/user.entity';
import { ApiOkResponseCustom } from 'src/common/decorators/api-response.decorator';
import { UserDecorator } from 'src/common/decorators/current-user.decorator';

@ApiTags('Auth')
@ApiGlobalResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @ApiOkResponseCustom(User)
  @Post('/login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req.user as CurrentUser, res);
  }

  @Public()
  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    return await this.authService.register(payload);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res, req.user as CurrentUser);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;
    return await this.authService.refreshToken(refreshToken, response);
  }

  @Get('profile')
  async getProfile(@UserDecorator() user: CurrentUser) {
    return await this.authService.getProfile(user);
  }

  @Post('verify-email')
  @Public()
  async verifyEmail(@Body('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Post('resend-verify-email')
  @Public()
  async resendVerifyEmail(@Body('email') email: string) {
    return await this.authService.resendVerifyEmail(email);
  }
}
