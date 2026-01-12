import { Injectable } from '@nestjs/common';
import { Workspace } from './entities/workspace.entity';
import { BaseRepository } from 'src/core/base/base.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor(private readonly dataSource: DataSource) {
    super(Workspace, dataSource.createEntityManager());
  }
}
