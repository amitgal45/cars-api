import { QueryRunner } from 'typeorm';

export class MigrationUtils {
  /**
   * Safely add column to table with checks
   */
  static async safeAddColumn(
    queryRunner: QueryRunner,
    table: string,
    column: string,
    definition: string,
  ): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(table, column);
    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition}`,
      );
    }
  }

  /**
   * Safely create index with checks ---/
   */
  static async safeCreateIndex(
    queryRunner: QueryRunner,
    table: string,
    columns: string[],
    indexName: string,
    unique = false,
  ): Promise<void> {
    const hasIndex = await this.hasIndex(queryRunner, table, indexName);
    if (!hasIndex) {
      await queryRunner.query(
        `CREATE ${
          unique ? 'UNIQUE' : ''
        } INDEX "${indexName}" ON "${table}" (${columns
          .map((col) => `"${col}"`)
          .join(', ')})`,
      );
    }
  }

  /**
   * Check if index exists
   */
  static async hasIndex(
    queryRunner: QueryRunner,
    table: string,
    indexName: string,
  ): Promise<boolean> {
    const result = await queryRunner.query(
      `SELECT COUNT(*) FROM pg_indexes WHERE tablename = $1 AND indexname = $2`,
      [table, indexName],
    );
    return parseInt(result[0].count) > 0;
  }

  /**
   * Safely drop column with checks
   */
  static async safeDropColumn(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(table, column);
    if (hasColumn) {
      await queryRunner.dropColumn(table, column);
    }
  }
}
