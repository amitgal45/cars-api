export interface ISendSms {
  to: string;
  message: string;
  templateId?: string;
  templateData?: Record<string, any>;
}

export interface ISmsProvider {
  sendSms(data: ISendSms): Promise<{ success: boolean; message: string }>;
}
