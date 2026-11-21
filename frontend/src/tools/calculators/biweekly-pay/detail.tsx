import type { ToolPageDetail } from '@/tools/page-detail';
import { BiweeklyPayGuideArticle } from './BiweeklyPayGuideArticle';
import { BIWEEKLY_PAY_FAQS, BIWEEKLY_PAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert annual, monthly, weekly, daily, or hourly wage into biweekly pay (every two weeks, 26 periods/year) with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Biweekly Pay Calculator',
  tocItems: BIWEEKLY_PAY_TOC_ITEMS,
  GuideArticle: BiweeklyPayGuideArticle,
  faqs: BIWEEKLY_PAY_FAQS,
  countryRules: null,
};
