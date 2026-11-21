import type { ToolPageDetail } from '@/tools/page-detail';
import { DueDateGuideArticle } from './DueDateGuideArticle';
import { DUE_DATE_FAQS, DUE_DATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a pregnancy due date from the first day of your last period or a conception date using ACOG-style calendar dating—educational only.',
  asideAriaLabel: 'Interactive Due Date Calculator',
  tocItems: DUE_DATE_TOC_ITEMS,
  GuideArticle: DueDateGuideArticle,
  faqs: DUE_DATE_FAQS,
  countryRules: null,
};
