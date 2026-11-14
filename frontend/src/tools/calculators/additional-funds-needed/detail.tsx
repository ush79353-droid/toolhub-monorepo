import type { ToolPageDetail } from '@/tools/page-detail';
import { AdditionalFundsNeededGuideArticle } from './AdditionalFundsNeededGuideArticle';
import { AFN_FAQS, AFN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how much external financing a growth plan still needs after spontaneous liabilities and retained earnings. Simplified AFN is a planning sketch, not a cash-flow forecast.',
  asideAriaLabel: 'Interactive additional funds needed calculator',
  tocItems: AFN_TOC_ITEMS,
  GuideArticle: AdditionalFundsNeededGuideArticle,
  faqs: AFN_FAQS,
  countryRules: null,
};
