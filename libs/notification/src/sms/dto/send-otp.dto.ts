export class SendOtpDto {
  to: string;
  templateId?: string;
  templateData?: Record<string, any>;
}
