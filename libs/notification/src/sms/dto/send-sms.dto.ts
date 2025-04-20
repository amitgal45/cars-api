import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SmsTemplateType } from '@gearspace/database/entities/template-sms.entity';

export class SendSmsDto {
  @ApiProperty({ description: 'Recipient phone number' })
  @IsString()
  to: string;

  @ApiProperty({ description: 'Message content (required if template is not provided)' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Template type to use',
    enum: SmsTemplateType,
    required: false,
  })
  @IsEnum(SmsTemplateType)
  @IsOptional()
  template?: SmsTemplateType;

  @ApiProperty({
    description: 'Template data for variable substitution',
    required: false,
  })
  @IsObject()
  @IsOptional()
  templateData?: Record<string, any>;
}
