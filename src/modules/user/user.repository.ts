import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/base/base.repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findAndUpdateByEmail(email: string, payload: Partial<User>) {
    return this.createQueryBuilder()
      .update(User)
      .set(payload)
      .where('email = :email', { email })
      .returning('*')
      .execute();
  }
}
