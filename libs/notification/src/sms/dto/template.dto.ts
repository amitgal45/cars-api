import { IsString, IsEnum, IsArray, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SmsTemplateType } from '@gearspace/database/entities/template-sms.entity';

export class CreateTemplateDto {
  @ApiProperty({ enum: SmsTemplateType })
  @IsEnum(SmsTemplateType)
  type: SmsTemplateType;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateTemplateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class TemplateMetadataDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  variables: string[];
} 