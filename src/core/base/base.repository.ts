import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
} from 'typeorm';
import { BaseEntity } from './base.entity';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseRepository<
  T extends BaseEntity,
> extends Repository<T> {
  /**
   * Find all entities with pagination
   */
  async findAllPaginated(
    options: FindManyOptions<T> = {},
    pagination: PaginationOptions = {},
  ): Promise<PaginationResult<T>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find one by id
   */
  async findById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
    return this.findOne({
      where: { id } as FindOptionsWhere<T>,
      ...options,
    });
  }

  /**
   * Find one or fail
   */
  async findByIdOrFail(id: string, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.findById(id, options);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return entity;
  }

  /**
   * Create and save entity
   */
  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data);
    return this.save(entity);
  }

  /**
   * Update entity by id
   */
  async updateEntity(id: string, data: DeepPartial<T>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.update(id, data as any);
    return this.findByIdOrFail(id);
  }

  /**
   * Soft delete entity by id
   */
  async softDeleteEntity(id: string): Promise<void> {
    await this.softDelete(id);
  }

  /**
   * Hard delete entity by id
   */
  async deleteEntity(id: string): Promise<void> {
    await this.delete(id);
  }

  /**
   * Restore soft deleted entity
   */
  async restoreEntity(id: string): Promise<void> {
    await this.restore(id);
  }

  /**
   * Check if entity exists
   */
  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }

  /**
   * Find all without pagination
   */
  async findAllNoPagination(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.find(options);
  }

  /**
   * Count entities
   */
  async countEntities(where?: FindOptionsWhere<T>): Promise<number> {
    return this.count({ where });
  }
}
