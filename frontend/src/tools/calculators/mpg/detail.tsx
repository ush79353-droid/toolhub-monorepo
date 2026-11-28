import type { ToolPageDetail } from '@/tools/page-detail';
import { MpgGuideArticle } from './MpgGuideArticle';
import { MPG_FAQS, MPG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate miles per gallon, convert fuel economy units, and estimate trip fuel cost — US and Imperial gallons supported.',
  asideAriaLabel: 'Interactive MPG Calculator',
  tocItems: MPG_TOC_ITEMS,
  GuideArticle: MpgGuideArticle,
  faqs: MPG_FAQS,
  countryRules: null,
};
