import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { InvalidCredentialsException } from 'src/core/exception/custom.exception';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    userPayload: CurrentUser,
    res: Response,
  ): Promise<{ accessToken: string; user: User }> {
    const { name, id, email } = userPayload;
    const detailUser = await this.userService.findOne(id, {
      select: ['avatar', 'email', 'name', 'id'],
    });
    const payload = {
      sub: 'access token',
      iss: 'from server',
      name,
      id,
      email,
    };

    const refreshToken = await this.generateRefreshToken(userPayload);
    await this.userService.update(id, { refresh_token: refreshToken });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(
        this.configService.get<StringValue>('JWT_REFRESH_EXPIRES', '7d'),
      ),
    });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: detailUser,
    };
  }

  async logout(response: Response, user: CurrentUser) {
    await this.userService.update(user.id, { refresh_token: '' });
    response.clearCookie('refresh_token');
    return { message: 'logout success' };
  }

  async validateUser(payload: LoginDto): Promise<User> {
    console.log(payload);
    const auth = await this.userService.findOneBy({
      email: payload.username,
    });

    console.log(auth);

    if (!auth) {
      throw new InvalidCredentialsException('Invalid email or password');
    }
    if (!auth.verified) {
      throw new InvalidCredentialsException('Email not verify');
    }

    const isComparePassword = await comparePassword(
      payload.password,
      auth.password,
    );
    if (!isComparePassword) {
      throw new InvalidCredentialsException('Invalid email or password');
    }
    return auth;
  }

  private async generateRefreshToken(user: CurrentUser): Promise<string> {
    const { name, id, email } = user;

    const payload = {
      sub: 'refresh token',
      iss: 'from server',
      name,
      id,
      email,
    };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_REFRESH_EXPIRES'),
    });
    return refreshToken;
  }
}
