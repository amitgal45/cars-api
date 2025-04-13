import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseHealthIndicator } from './database.health';
import { DataSourceOptions } from 'typeorm';
import { getDatabaseConfig } from './config/database.config';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        // LoggerModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const config = getDatabaseConfig(configService);
            return {
              ...config,
              // autoLoadEntities: true, // This will automatically load entities
              // synchronize: process.env.NODE_ENV !== 'production', // Be careful with this in production
              // synchronize: true, // Disable synchronize in production
              logging: process.env.NODE_ENV === 'development',
              maxQueryExecutionTime: 1000, // Log slow queries
              poolSize: 20, // Adjust based on your needs
              extra: {
                // Connection pool settings
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
              },
            } as DataSourceOptions;
          },
          inject: [ConfigService],
        }),
      ],
      providers: [DatabaseService, DatabaseHealthIndicator],
      exports: [DatabaseService, DatabaseHealthIndicator, TypeOrmModule],
      global: true,
    };
  }

  // Enhanced forFeature method with performance optimizations
  static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    return TypeOrmModule.forFeature(entities);
  }
}
