import type { ToolPageDetail } from '@/tools/page-detail';
import { CyberMondayGuideArticle } from './CyberMondayGuideArticle';
import { CYBER_MONDAY_FAQS, CYBER_MONDAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Cyber Monday discounts, coupons, BOGO offers, sales tax, shipping, and your real checkout total.',
  asideAriaLabel: 'Interactive Cyber Monday Calculator',
  tocItems: CYBER_MONDAY_TOC_ITEMS,
  GuideArticle: CyberMondayGuideArticle,
  faqs: CYBER_MONDAY_FAQS,
  countryRules: null,
};
