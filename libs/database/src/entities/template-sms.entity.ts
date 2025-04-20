import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const SmsTemplateType = {
  WELCOME: 'WELCOME',
  VERIFICATION: 'VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  CAR_LISTING: 'CAR_LISTING',
  APPOINTMENT: 'APPOINTMENT',
};

export type SmsTemplateType = typeof SmsTemplateType[keyof typeof SmsTemplateType];

@Entity('sms_templates')
export class SmsTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SmsTemplateType,
    unique: true,
  })
  type: SmsTemplateType;

  @Column()
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  static readonly TEMPLATES = {
    [SmsTemplateType.WELCOME]: {
      type: SmsTemplateType.WELCOME,
      content: 'Welcome to CarSpace! Your account has been created successfully. Your verification code is: {{code}}',
      metadata: {
        description: 'Welcome message with verification code',
        variables: ['code'],
      },
    },
    [SmsTemplateType.VERIFICATION]: {
      type: SmsTemplateType.VERIFICATION,
      content: 'Your CarSpace verification code is: {{code}}. Valid for 10 minutes.',
      metadata: {
        description: 'Verification code message',
        variables: ['code'],
      },
    },
    [SmsTemplateType.PASSWORD_RESET]: {
      type: SmsTemplateType.PASSWORD_RESET,
      content:
        'Your CarSpace password reset code is: {{code}}. If you did not request this, please ignore this message.',
      metadata: {
        description: 'Password reset code message',
        variables: ['code'],
      },
    },
    [SmsTemplateType.CAR_LISTING]: {
      type: SmsTemplateType.CAR_LISTING,
      content: 'New car listing: {{make}} {{model}} {{year}} for {{price}}. Contact: {{contact}}',
      metadata: {
        description: 'New car listing notification',
        variables: ['make', 'model', 'year', 'price', 'contact'],
      },
    },
    [SmsTemplateType.APPOINTMENT]: {
      type: SmsTemplateType.APPOINTMENT,
      content: 'Your car appointment is scheduled for {{date}} at {{time}}. Location: {{location}}',
      metadata: {
        description: 'Appointment confirmation',
        variables: ['date', 'time', 'location'],
      },
    },
  };
}
