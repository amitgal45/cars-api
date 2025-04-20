import { Injectable } from '@nestjs/common';
import { ITemplateEngine } from '../interfaces/template-engine.interface';

@Injectable()
export class SimpleTemplateEngine implements ITemplateEngine {
  render(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key].toString() : match;
    });
  }
}
