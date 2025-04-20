import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplateService } from '../services/template.service';
import { SmsTemplate } from '@gearspace/database/entities/template-sms.entity';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/template.dto';

@ApiTags('SMS Templates')
@Controller('sms/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  @ApiOperation({ summary: 'List all SMS templates' })
  @ApiResponse({ status: 200, type: [SmsTemplate] })
  async listTemplates(): Promise<SmsTemplate[]> {
    return this.templateService.listTemplates();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new SMS template' })
  @ApiResponse({ status: 201, type: SmsTemplate })
  async createTemplate(@Body() dto: CreateTemplateDto): Promise<SmsTemplate> {
    return this.templateService.createTemplate(dto);
  }

  @Put(':type')
  @ApiOperation({ summary: 'Update an existing SMS template' })
  @ApiResponse({ status: 200, type: SmsTemplate })
  async updateTemplate(@Param('type') type: string, @Body() dto: UpdateTemplateDto): Promise<SmsTemplate> {
    return this.templateService.updateTemplate(type as any, dto);
  }

  @Delete(':type')
  @ApiOperation({ summary: 'Delete an SMS template' })
  @ApiResponse({ status: 200 })
  async deleteTemplate(@Param('type') type: string): Promise<void> {
    return this.templateService.deleteTemplate(type as any);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default SMS templates' })
  @ApiResponse({ status: 200 })
  async seedTemplates(): Promise<void> {
    return this.templateService.seedTemplates();
  }
}
