import type { ToolPageDetail } from '@/tools/page-detail';
import { MaturityValueGuideArticle } from './MaturityValueGuideArticle';
import { MV_FAQS, MV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate investment maturity value from principal, annual interest rate, and time using annual compound interest.',
  asideAriaLabel: 'Interactive Maturity Value Calculator',
  tocItems: MV_TOC_ITEMS,
  GuideArticle: MaturityValueGuideArticle,
  faqs: MV_FAQS,
  countryRules: null,
};
