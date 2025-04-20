import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioProvider } from './providers/twilio.provider';
import { SimpleTemplateEngine } from './engines/simple-template.engine';
import { SmsService } from './sms.service';
import { TemplateService } from './services/template.service';
import { TemplateController } from './controllers/template.controller';
import { SmsTemplate } from '@gearspace/database/entities/template-sms.entity';
import { INJECTION_TOKENS } from '../shared/notification.constant';
import { OtpService } from './services/otp.service';
import { DatabaseModule } from '@gearspace/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule, DatabaseModule.forFeature([SmsTemplate])],
  controllers: [TemplateController],
  providers: [
    {
      provide: INJECTION_TOKENS.SMS_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const provider = configService.get('SMS_PROVIDER', 'twilio');
        if (provider === 'twilio') {
          return new TwilioProvider(
            configService.get('TWILIO_ACCOUNT_SID'),
            configService.get('TWILIO_AUTH_TOKEN'),
            configService.get('TWILIO_FROM_NUMBER'),
            new SimpleTemplateEngine(),
          );
        }
        throw new Error(`Unsupported SMS provider: ${provider}`);
      },
      inject: [ConfigService],
    },
    {
      provide: INJECTION_TOKENS.TEMPLATE_ENGINE,
      useClass: SimpleTemplateEngine,
    },
    {
      provide: INJECTION_TOKENS.OTP_SERVICE,
      useClass: OtpService,
    },
    SimpleTemplateEngine,
    TemplateService,
    SmsService,
    OtpService,
  ],
  exports: [
    SmsService,
    TemplateService,
    OtpService,
    INJECTION_TOKENS.SMS_PROVIDER,
    INJECTION_TOKENS.TEMPLATE_ENGINE,
    INJECTION_TOKENS.OTP_SERVICE,
    SimpleTemplateEngine,
    TypeOrmModule,
  ],
})
export class SmsModule {}
