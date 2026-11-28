import type { ToolPageDetail } from '@/tools/page-detail';
import { BsfcGuideArticle } from './BsfcGuideArticle';
import { BSFC_FAQS, BSFC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate brake thermal efficiency, fuel consumption rate, and BSFC from brake power, fuel type, and lower heating value — with unit conversions and reverse modes.',
  asideAriaLabel: 'Interactive BSFC Calculator',
  tocItems: BSFC_TOC_ITEMS,
  GuideArticle: BsfcGuideArticle,
  faqs: BSFC_FAQS,
  countryRules: null,
};
