export interface ITemplateEngine {
  render(template: string, data: Record<string, any>): string;
}
