import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { config } from 'dotenv';
import * as entities from '../entities';

// Load environment variables from .env file
config();

const configService = new ConfigService();

export const getDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => {
  const databaseHost = configService.get<string>('DATABASE_HOST');
  const databasePort = configService.get<number>('DATABASE_PORT');
  const databaseUsername = configService.get<string>('DATABASE_USERNAME');
  const databasePassword = configService.get<string>('DATABASE_PASSWORD');
  const databaseName = configService.get<string>('DATABASE_NAME');

  return {
    type: 'postgres',
    host: databaseHost,
    port: databasePort,
    username: databaseUsername,
    password: databasePassword,
    database: databaseName,
    entities: Object.values(entities),
    migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    poolSize: parseInt(configService.get('DB_POOL_SIZE', '10')),
  } as DataSourceOptions;
};

// Create and export a DataSource instance
export default new DataSource(getDatabaseConfig(configService));
