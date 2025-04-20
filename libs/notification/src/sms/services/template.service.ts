import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SmsTemplate, SmsTemplateType } from '@gearspace/database/entities/template-sms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ITemplateEngine } from '../interfaces/template-engine.interface';
import { SMS_TOKENS } from '../constants/sms.constants';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(SmsTemplate)
    private readonly templateRepository: Repository<SmsTemplate>,
    @Inject(SMS_TOKENS.TEMPLATE_ENGINE)
    private readonly templateEngine: ITemplateEngine,
  ) {}

  async getTemplate(type: SmsTemplateType): Promise<SmsTemplate> {
    const template = await this.templateRepository.findOne({
      where: { type },
    });

    if (!template) {
      throw new Error(`Template ${type} not found`);
    }

    return template;
  }

  async validateTemplateData(template: SmsTemplate, data: Record<string, any>): Promise<void> {
    const requiredVariables = template.metadata.variables;
    const missingVariables = requiredVariables.filter((variable) => !(variable in data));

    if (missingVariables.length > 0) {
      throw new Error(`Missing required template variables: ${missingVariables.join(', ')}`);
    }
  }

  async renderTemplate(type: SmsTemplateType, data: Record<string, any>): Promise<string> {
    const template = await this.getTemplate(type);
    await this.validateTemplateData(template, data);
    return this.templateEngine.render(template.content, data);
  }

  async createTemplate(template: Partial<SmsTemplate>): Promise<SmsTemplate> {
    return this.templateRepository.save(template);
  }

  async updateTemplate(type: SmsTemplateType, updates: Partial<SmsTemplate>): Promise<SmsTemplate> {
    const template = await this.getTemplate(type);
    return this.templateRepository.save({ ...template, ...updates });
  }

  async deleteTemplate(type: SmsTemplateType): Promise<void> {
    await this.templateRepository.delete({ type });
  }

  async listTemplates(): Promise<SmsTemplate[]> {
    return this.templateRepository.find();
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
