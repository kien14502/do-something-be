import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import { hashPassword } from 'src/shared/utils/bcrypt';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async createUser(payload: CreateUserDto) {
    const hashedPassword = await hashPassword(payload.password);
    const user = this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });
    return user.save();
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
  async findAndUpdateByEmail(email: string, payload: Partial<User>) {
    return await this.userRepository.findAndUpdateByEmail(email, payload);
  }
}
