import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { DatabaseService } from './database.service';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.databaseService.testConnection();
      return this.getStatus(key, isHealthy);
    } catch (error) {
      throw new HealthCheckError(
        'DatabaseCheck failed',
        this.getStatus(key, false, { message: error.message }),
      );
    }
  }
}
