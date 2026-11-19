import type { ToolPageDetail } from '@/tools/page-detail';
import { YearlyWageGuideArticle } from './YearlyWageGuideArticle';
import { YEARLY_WAGE_FAQS, YEARLY_WAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly wage to yearly wage from hours and weeks worked (0–52 weeks), then estimate net pay after a simplified flat tax with independent FX on each money field.',
  asideAriaLabel: 'Interactive Yearly Wage Calculator',
  tocItems: YEARLY_WAGE_TOC_ITEMS,
  GuideArticle: YearlyWageGuideArticle,
  faqs: YEARLY_WAGE_FAQS,
  countryRules: null,
};
