import type { ToolPageDetail } from '@/tools/page-detail';
import { PricePerSqmGuideArticle } from './PricePerSqmGuideArticle';
import { PPSM_FAQS, PPSM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate purchase or rental price per square meter (or foot), reverse to total price or area, convert units consistently, and optionally compare a second property, with square meters as the default unit.',
  asideAriaLabel: 'Interactive Price Per Square Meter Calculator',
  tocItems: PPSM_TOC_ITEMS,
  GuideArticle: PricePerSqmGuideArticle,
  faqs: PPSM_FAQS,
  countryRules: null,
};
