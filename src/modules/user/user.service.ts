import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResourceAlreadyExistsException } from 'src/core/exception/custom.exception';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
  async createUser(payload: CreateUserDto) {
    const isExistUser = await this.findBy({ email: payload.email });
    if (isExistUser)
      throw new ResourceAlreadyExistsException('User', 'email', payload.email);
    const user = await this.create(payload);
    return user;
  }
}
