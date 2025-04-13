import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
  EntityManager,
  QueryRunner,
  DataSource,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '@gearspace/database';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends BaseEntity> {
  protected queryRunner: QueryRunner | null = null;
  protected transactionManager: EntityManager | null = null;

  constructor(protected readonly repository: Repository<T>, protected readonly dataSource: DataSource) {}

  /**
   * Starts a new transaction
   */
  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    this.transactionManager = this.queryRunner.manager;
  }

  /**
   * Commits the current transaction
   */
  async commitTransaction(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.commitTransaction();
      await this.queryRunner.release();
      this.cleanupTransaction();
    }
  }

  /**
   * Rollbacks the current transaction
   */
  async rollbackTransaction(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
      this.cleanupTransaction();
    }
  }

  /**
   * Executes operations within a transaction
   * @param operation - Function containing the operations to execute
   */
  async withTransaction<R>(operation: (entityManager: EntityManager) => Promise<R>): Promise<R> {
    try {
      await this.startTransaction();
      const result = await operation(this.transactionManager);
      await this.commitTransaction();
      return result;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    }
  }

  private cleanupTransaction(): void {
    this.queryRunner = null;
    this.transactionManager = null;
  }

  private getManager(): EntityManager {
    return this.transactionManager || this.repository.manager;
  }

  async findById(id: string, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.getManager().findOne(this.repository.target, {
      ...options,
      where: { id } as FindOptionsWhere<T>,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return entity;
  }

  async findOneOrNull(options: FindOneOptions<T>): Promise<T | null> {
    return this.getManager().findOne(this.repository.target, options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.getManager().save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.getManager().update(this.repository.target, id, data as QueryDeepPartialEntity<T>);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getManager().delete(this.repository.target, id);
    return !!result.affected;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.getManager().softDelete(this.repository.target, id);
    return !!result.affected;
  }

  createQueryBuilder(alias: string) {
    return this.getManager().createQueryBuilder(this.repository.target, alias);
  }

  /**
   * @deprecated Use withTransaction() instead
   */
  transaction() {
    return this.repository.manager.transaction.bind(this.repository.manager);
  }
}
