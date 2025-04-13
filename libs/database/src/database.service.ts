import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    await this.testConnection();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string) {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.dataSource?.isInitialized) {
        await this.dataSource.initialize();
      }
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async runTransaction<T>(operation: (entityManager: EntityManager) => Promise<T> | T): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async executeQuery<T>(query: string, parameters?: unknown[]): Promise<T> {
    return this.dataSource.query(query, parameters);
  }

  async withTransaction<T>(operation: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
