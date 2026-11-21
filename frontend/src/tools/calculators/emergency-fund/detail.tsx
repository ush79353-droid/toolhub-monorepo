import type { ToolPageDetail } from '@/tools/page-detail';
import { EMERGENCY_FUND_FAQS, EMERGENCY_FUND_TOC_ITEMS } from './content';
import { EmergencyFundGuideArticle } from './EmergencyFundGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how much emergency savings you need from average monthly expenses and the months of coverage you want. Currency changes formatting only.',
  asideAriaLabel: 'Emergency Fund Calculator guide',
  tocItems: EMERGENCY_FUND_TOC_ITEMS,
  GuideArticle: EmergencyFundGuideArticle,
  faqs: EMERGENCY_FUND_FAQS,
  countryRules: null,
};
