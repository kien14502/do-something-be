import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import {
  InvalidCredentialsException,
  ResourceAlreadyExistsException,
  ValidationException,
} from 'src/core/exception/custom.exception';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/shared/interfaces/user.interface';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { MailersService } from 'src/common/services/mailers/mailers.service';
import { RedisService } from 'src/common/services/redis/redis.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailersService: MailersService,
    private readonly redisService: RedisService,
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

  async register(payload: CreateUserDto) {
    const userExisted = await this.userService.findUserByEmail(payload.email);

    if (userExisted) {
      throw new ResourceAlreadyExistsException('User', 'email', payload.email);
    }
    const token = randomUUID();
    const redisKey = `verify:${token}`;

    await this.redisService.set(redisKey, payload.email, 10 * 60);
    await this.mailersService.sendEmailRegister(payload.email, token);

    const newUser = await this.userService.createUser(payload);
    return newUser;
  }

  async refreshToken(
    refreshToken: string,
    response: Response,
  ): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.findOneBy({
        refresh_token: refreshToken,
      });
      if (!user) {
        response.clearCookie('refresh_token');
        throw new InvalidCredentialsException('Invalid token');
      }
      const { name, id, email } = user;

      const reset_refreshToken = await this.generateRefreshToken({
        name,
        id,
        email,
      });

      await this.userService.update(id, { refresh_token: reset_refreshToken });
      response.clearCookie('refresh_token');
      response.cookie('refresh_token', reset_refreshToken, {
        httpOnly: true,
        maxAge: ms(
          this.configService.get<StringValue>('JWT_REFRESH_EXPIRES', '7d'),
        ),
      });
      return {
        accessToken: await this.jwtService.signAsync({ name, id, email }),
      };
    } catch (error) {
      console.log(error);
      response.clearCookie('refresh_token');
      throw new InvalidCredentialsException('Invalid token');
    }
  }

  async getProfile(user: CurrentUser) {
    const profile = await this.userService.findOne(user.id);
    return profile;
  }

  async verifyEmail(token: string) {
    const redisKey = `verify:${token}`;
    const email = await this.redisService.get(redisKey);
    if (!email) {
      throw new ValidationException('Invalid token');
    }
    const user = await this.userService.findAndUpdateByEmail(email, {
      verified: true,
    });
    await this.redisService.del(redisKey);
    return { message: 'Email verified successfully', user: user };
  }

  async resendVerifyEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException('Invalid email');
    }
    if (user.verified) {
      throw new InvalidCredentialsException('Email already verified');
    }
    const token = randomUUID();
    const redisKey = `verify:${token}`;

    await this.redisService.set(redisKey, email, 10 * 60);
    await this.mailersService.sendEmailRegister(email, token);
  }

  async validateUser(payload: LoginDto): Promise<User> {
    const auth = await this.userService.findOneBy({
      email: payload.username,
    });

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
      expiresIn: ms(
        this.configService.get<StringValue>('JWT_REFRESH_EXPIRES', '7d'),
      ),
    });
    return refreshToken;
  }
}
