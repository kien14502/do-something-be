import { BaseRepository } from 'src/core/base/base.repository';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

export class UserRepository extends BaseRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
