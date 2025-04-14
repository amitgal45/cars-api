import { EmailTemplate } from '@gearspace/database';

export interface ITemplateRepository {
  findById(id: string): Promise<EmailTemplate>;
}
