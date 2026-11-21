import type { ToolPageDetail } from '@/tools/page-detail';
import { PayRaiseGuideArticle } from './PayRaiseGuideArticle';
import { PAY_RAISE_FAQS, PAY_RAISE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Model a percentage or cash pay raise across hourly, weekly, monthly, and annual pay from hours per week — independent FX on each money field; hours and % never convert.',
  asideAriaLabel: 'Interactive Pay Raise Calculator',
  tocItems: PAY_RAISE_TOC_ITEMS,
  GuideArticle: PayRaiseGuideArticle,
  faqs: PAY_RAISE_FAQS,
  countryRules: null,
};
