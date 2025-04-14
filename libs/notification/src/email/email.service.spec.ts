import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailTemplate } from '@gearspace/database/entities/template-email.entity';
import { INJECTION_TOKENS } from './constant/injection-tokens';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridProvider } from './providers/sendgrid.provider';

describe('EmailService', () => {
  let service: EmailService;
  let mockTemplateEngine: any;
  let mockTemplateRepository: any;
  let configService: ConfigService;

  beforeEach(async () => {
    mockTemplateEngine = {
      render: jest.fn().mockImplementation((template, data) => Promise.resolve(template)),
      renderSubject: jest.fn().mockImplementation((template, data) => Promise.resolve(template)),
    };

    mockTemplateRepository = {
      findById: jest.fn().mockImplementation((id) => {
        const templates = {
          'welcome-email': EmailTemplate.WELCOME_EMAIL,
          'password-reset': EmailTemplate.PASSWORD_RESET,
          'car-listing-notification': EmailTemplate.CAR_LISTING_NOTIFICATION,
        };
        return Promise.resolve(templates[id]);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      providers: [
        EmailService,
        {
          provide: INJECTION_TOKENS.EMAIL_PROVIDER,
          useFactory: (config: ConfigService) => {
            const apiKey = config.get('SENDGRID_API_KEY');
            const fromEmail = config.get('EMAIL_FROM_ADDRESS');
            if (!apiKey || !fromEmail) {
              throw new Error('SENDGRID_API_KEY and EMAIL_FROM_ADDRESS must be set in .env');
            }
            return new SendGridProvider(apiKey, fromEmail);
          },
          inject: [ConfigService],
        },
        {
          provide: INJECTION_TOKENS.TEMPLATE_ENGINE,
          useValue: mockTemplateEngine,
        },
        {
          provide: INJECTION_TOKENS.TEMPLATE_REPOSITORY,
          useValue: mockTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should send welcome email', async () => {
    const emailData = {
      to: 'amitgal45@gmail.com',
      templateId: 'welcome-email',
      templateData: {
        name: 'John Doe',
        email: 'amitgal45@gmail.com',
        accountType: 'Premium',
      },
    };

    const result = await service.sendTemplatedEmail(emailData);
    console.log('Welcome email result:', result);
    expect(result.success).toBe(true);
    expect(mockTemplateRepository.findById).toHaveBeenCalledWith('welcome-email');
  }, 30000);

  it('should send password reset email', async () => {
    const emailData = {
      to: 'amitgal45@gmail.com',
      templateId: 'password-reset',
      templateData: {
        name: 'John Doe',
        resetLink: 'https://cars-api.com/reset-password?token=abc123',
        expiryTime: 30,
      },
    };

    const result = await service.sendTemplatedEmail(emailData);
    console.log('Password reset email result:', result);
    expect(result.success).toBe(true);
    expect(mockTemplateRepository.findById).toHaveBeenCalledWith('password-reset');
  }, 30000);

  it('should send car listing notification', async () => {
    const emailData = {
      to: 'amitgal45@gmail.com',
      templateId: 'car-listing-notification',
      templateData: {
        name: 'John Doe',
        carMake: 'Toyota',
        carModel: 'Camry',
        carYear: 2022,
        price: '$25,000',
        mileage: 15000,
        location: 'New York, NY',
        listingUrl: 'https://cars-api.com/listings/123',
      },
    };

    const result = await service.sendTemplatedEmail(emailData);
    console.log('Car listing notification result:', result);
    expect(result.success).toBe(true);
    expect(mockTemplateRepository.findById).toHaveBeenCalledWith('car-listing-notification');
  }, 30000);
}); 