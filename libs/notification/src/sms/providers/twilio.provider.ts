import { Injectable } from '@nestjs/common';
import { ISmsProvider } from '../interfaces/sms-provider.interface';
import { SendSmsDto } from '../dto/send-sms.dto';
import * as twilio from 'twilio';
import { ITemplateEngine } from '../interfaces/template-engine.interface';
import { SmsTemplate } from '@gearspace/database/entities/template-sms.entity';

@Injectable()
export class TwilioProvider implements ISmsProvider {
  private readonly client: twilio.Twilio;

  constructor(
    private readonly accountSid: string,
    private readonly authToken: string,
    private readonly fromNumber: string,
    private readonly templateEngine: ITemplateEngine,
  ) {
    this.client = twilio(accountSid, authToken);
  }

  async sendSms(data: SendSmsDto): Promise<{ success: boolean; message: string }> {
    try {
      let messageContent = data.message;

      // If template is provided, render it with the data
      if (data.template) {
        const template = SmsTemplate.TEMPLATES[data.template];
        if (!template) {
          throw new Error(`Template ${data.template} not found`);
        }

        // Validate required variables
        const requiredVariables = template.metadata.variables;
        const missingVariables = requiredVariables.filter((variable) => !(variable in data.templateData));

        if (missingVariables.length > 0) {
          throw new Error(`Missing required template variables: ${missingVariables.join(', ')}`);
        }

        messageContent = this.templateEngine.render(template.content, data.templateData);
      }

      const result = await this.client.messages.create({
        body: messageContent,
        to: data.to,
        from: this.fromNumber,
      });

      return {
        success: true,
        message: `Message sent successfully. SID: ${result.sid}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send SMS via Twilio',
      };
    }
  }
}
