import { DeepPartial, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from './base.entity';
import {
  BaseRepository,
  PaginationOptions,
  PaginationResult,
} from './base.repository';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  /**
   * Find all with pagination
   */
  async findAll(
    options: FindManyOptions<T> = {},
    pagination?: PaginationOptions,
  ): Promise<PaginationResult<T> | T[]> {
    if (pagination) {
      return this.repository.findAllPaginated(options, pagination);
    }
    return this.repository.findAllNoPagination(options);
  }

  /**
   * Find one by id
   */
  async findOne(id: string, options?: FindManyOptions<T>): Promise<T> {
    const entity = await this.repository.findById(id, options);
    if (!entity) {
      throw new NotFoundException(this.getNotFoundMessage(id));
    }
    return entity;
  }

  /**
   * Find by condition
   */
  async findBy(
    where: FindOptionsWhere<T>,
    options?: FindManyOptions<T>,
  ): Promise<T[]> {
    return this.repository.find({
      where,
      ...options,
    });
  }

  /**
   * Find one by condition
   */
  async findOneBy(
    where: FindOptionsWhere<T>,
    options?: FindManyOptions<T>,
  ): Promise<T | null> {
    return this.repository.findOne({
      where,
      ...options,
    });
  }

  /**
   * Create new entity
   */
  async create(data: DeepPartial<T>): Promise<T> {
    return this.repository.createEntity(data);
  }

  /**
   * Update entity
   */
  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.findOne(id); // Check if exists
    return this.repository.updateEntity(id, data);
  }

  /**
   * Soft delete entity
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.repository.softDeleteEntity(id);
  }

  /**
   * Hard delete entity
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.repository.deleteEntity(id);
  }

  /**
   * Restore soft deleted entity
   */
  async restore(id: string): Promise<void> {
    await this.repository.restoreEntity(id);
  }

  /**
   * Check if exists
   */
  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    return this.repository.exists({ where });
  }

  /**
   * Count entities
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.countEntities(where);
  }

  /**
   * Get not found error message
   */
  protected getNotFoundMessage(id: string): string {
    return `Entity with id ${id} not found`;
  }
}
