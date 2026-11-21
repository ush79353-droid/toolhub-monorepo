import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditSpreadGuideArticle } from './CreditSpreadGuideArticle';
import { CREDIT_SPREAD_FAQS, CREDIT_SPREAD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Use our Credit Spread Calculator to find the difference between a corporate bond's yield and the yield of a comparable government bond. Calculate credit spreads in percentage points or basis points and understand what the result may indicate about bond risk.",
  asideAriaLabel: 'Interactive Credit Spread Calculator',
  tocItems: CREDIT_SPREAD_TOC_ITEMS,
  GuideArticle: CreditSpreadGuideArticle,
  faqs: CREDIT_SPREAD_FAQS,
  countryRules: null,
};
