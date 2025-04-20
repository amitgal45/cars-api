import { Injectable, Inject } from '@nestjs/common';
import { ISmsProvider } from './interfaces/sms-provider.interface';
import { SendSmsDto } from './dto/send-sms.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { INJECTION_TOKENS } from '../shared/notification.constant';
import { IOtpService } from './interfaces/otp-service.interface';
import { Repository } from 'typeorm';
import { SmsTemplate } from '@gearspace/database/entities/template-sms.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SmsService {
  constructor(
    @Inject(INJECTION_TOKENS.SMS_PROVIDER)
    private readonly smsProvider: ISmsProvider,
    @Inject(INJECTION_TOKENS.OTP_SERVICE)
    private readonly otpService: IOtpService,
    @InjectRepository(SmsTemplate)
    private readonly templateRepository: Repository<SmsTemplate>,
  ) {}

  async sendSms(data: SendSmsDto): Promise<{ success: boolean; message: string }> {
    // If using a template, validate and load it
    if (data.template) {
      const template = await this.templateRepository.findOne({
        where: { type: data.template },
      });

      if (!template) {
        throw new Error(`Template ${data.template} not found`);
      }

      // Validate required variables
      const requiredVariables = template.metadata.variables;
      const missingVariables = requiredVariables.filter((variable) => !(variable in data.templateData));

      if (missingVariables.length > 0) {
        throw new Error(`Missing required template variables: ${missingVariables.join(', ')}`);
      }
    }

    return this.smsProvider.sendSms({
      ...data,
      message: data.message || '',
    });
  }

  async sendOtp(data: SendOtpDto): Promise<{ success: boolean; message?: string; otpId?: string }> {
    try {
      // Generate OTP
      const otp = await this.otpService.generateOtp(data.to);

      // Prepare message with OTP
      const message = `Your verification code is: ${otp.code}. This code will expire in ${otp.expiresIn} minutes.`;

      // Send SMS with OTP
      const result = await this.smsProvider.sendSms({
        to: data.to,
        message,
        templateId: data.templateId,
        templateData: {
          ...data.templateData,
          code: otp.code,
          expiresIn: otp.expiresIn,
        },
      });

      return {
        success: true,
        message: result.message,
        otpId: otp?.id,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  async verifyOtp(data: VerifyOtpDto): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await this.otpService.verifyOtp(data.to, data.code);
      return {
        success: result.isValid,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }

  async seedTemplates(): Promise<void> {
    const templates = Object.values(SmsTemplate.TEMPLATES);
    for (const template of templates) {
      const existing = await this.templateRepository.findOne({
        where: { type: template.type },
      });

      if (!existing) {
        await this.templateRepository.save(template);
      }
    }
  }
}
