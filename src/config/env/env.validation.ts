import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateIf, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;
  
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRATION: string;

  @IsString()
  JWT_REFRESH_EXPIRATION: string;

  @IsString()
  JWT_ADMIN_ACCESS_SECRET: string;

  @IsString()
  JWT_ADMIN_ACCESS_EXPIRATION: string;

  @IsString()
  @IsEnum(['sendgrid', 'mailgun'])
  EMAIL_PROVIDER: 'sendgrid' | 'mailgun';

  @IsString()
  EMAIL_FROM_ADDRESS: string;

  @ValidateIf((o) => o.EMAIL_PROVIDER === 'sendgrid')
  @IsString()
  SENDGRID_API_KEY: string;

  @ValidateIf((o) => o.EMAIL_PROVIDER === 'mailgun')
  @IsString()
  MAILGUN_API_KEY: string;

  @ValidateIf((o) => o.EMAIL_PROVIDER === 'mailgun')
  @IsString()
  MAILGUN_DOMAIN: string;

  DB_POOL_SIZE: number;

  DB_IDLE_TIMEOUT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    {
      ...config,
      PORT: parseInt(config.PORT as string, 10),
      DB_PORT: parseInt(config.DB_PORT as string, 10),
      DB_POOL_SIZE: parseInt(config.DB_POOL_SIZE as string, 10),
      DB_IDLE_TIMEOUT: parseInt(config.DB_IDLE_TIMEOUT as string, 10)
    },
    { enableImplicitConversion: true }
  );

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
