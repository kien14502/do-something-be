import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CurrentUser } from 'src/shared/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<CurrentUser> {
    const user = await this.authService.validateUser({
      username: email,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      email: user.email,
      id: user.id,
      name: user.name,
    };
  }
}
