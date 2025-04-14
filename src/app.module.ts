import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule, User } from '@gearspace/database';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@gearspace/auth';
import { ClientAuthModule } from './auth/auth.module';
import { validate } from './config/env/env.validation';
import { EmailModule } from 'gearspace/notification/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true
      }
    }),
    DatabaseModule.forRoot(),
    AuthModule.register(),
    DatabaseModule.forFeature([User]),
    ClientAuthModule,
    // EmailModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
