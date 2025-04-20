import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioProvider } from './providers/twilio.provider';
import { INJECTION_TOKENS } from '../shared/notification.constant';

describe('SmsService', () => {
  let service: SmsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      providers: [
        SmsService,
        {
          provide: INJECTION_TOKENS.SMS_PROVIDER,
          useFactory: (config: ConfigService) => {
            const accountSid = config.get('TWILIO_ACCOUNT_SID');
            const authToken = config.get('TWILIO_AUTH_TOKEN');
            const fromNumber = config.get('TWILIO_FROM_NUMBER');

            if (!accountSid || !authToken || !fromNumber) {
              throw new Error('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER must be set in .env');
            }

            return new TwilioProvider(accountSid, authToken, fromNumber);
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should send SMS successfully', async () => {
    const smsData = {
      to: '+1234567890', // Replace with a valid phone number
      message: 'Test message from SMS service',
    };

    const result = await service.sendSms(smsData);
    console.log('SMS result:', result);
    expect(result.success).toBe(true);
  }, 30000);

  it('should handle SMS sending failure', async () => {
    const smsData = {
      to: 'invalid-number', // Invalid phone number to test error handling
      message: 'Test message',
    };

    const result = await service.sendSms(smsData);
    console.log('SMS error result:', result);
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  }, 30000);
});
