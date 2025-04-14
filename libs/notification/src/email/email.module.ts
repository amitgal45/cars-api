import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailTemplate } from '@gearspace/database/entities/template-email.entity';
import { DatabaseModule } from '@gearspace/database';
import { INJECTION_TOKENS } from './constant/injection-tokens';
import { EmailService } from './email.service';
import { EmailTemplateRepository } from './repositories/email.repository';
import { LiquidTemplateEngine } from './engines/liquid-template.engine';
import { SendGridProvider } from './providers/sendgrid.provider';
import { MailgunProvider } from './providers/mailgun.provider';

@Module({})
export class EmailModule {
  static forRoot(): DynamicModule {
    return {
      module: EmailModule,
      imports: [DatabaseModule.forFeature([EmailTemplate])],
      providers: [
        {
            provide: INJECTION_TOKENS.EMAIL_PROVIDER,
            useFactory: (configService: ConfigService) => {
              const provider = configService.get('EMAIL_PROVIDER');
              const apiKey = configService.get(provider === 'sendgrid' ? 'SENDGRID_API_KEY' : 'MAILGUN_API_KEY');
              const fromEmail = configService.get('EMAIL_FROM_ADDRESS');
              const domain = provider === 'mailgun' ? configService.get('MAILGUN_DOMAIN') : undefined;
              console.log('provider', provider);
              console.log('apiKey', apiKey);
              console.log('fromEmail', fromEmail);
              console.log('domain', domain);
              return provider === 'sendgrid'
                ? new SendGridProvider(apiKey, fromEmail)
                : new MailgunProvider(apiKey, domain, fromEmail);
            },
            inject: [ConfigService],
        },
        {
          provide: INJECTION_TOKENS.TEMPLATE_ENGINE,
          useClass: LiquidTemplateEngine,
        },
        EmailTemplateRepository,
        {
          provide: INJECTION_TOKENS.TEMPLATE_REPOSITORY,
          useExisting: EmailTemplateRepository,
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
