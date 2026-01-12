import { BaseRepository } from 'src/core/base/base.repository';
import { Sprint } from './entities/sprint.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SprintRepository extends BaseRepository<Sprint> {
  constructor(private dataSource: DataSource) {
    super(Sprint, dataSource.createEntityManager());
  }
}
