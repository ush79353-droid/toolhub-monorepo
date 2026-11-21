import type { ToolPageDetail } from '@/tools/page-detail';
import { PricePerSqftGuideArticle } from './PricePerSqftGuideArticle';
import { PPSF_FAQS, PPSF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate purchase or rental price per square foot or meter, reverse to total price or area, convert units consistently, and optionally compare a second property on a normalized unit-price basis.',
  asideAriaLabel: 'Interactive Price Per Square Foot Calculator',
  tocItems: PPSF_TOC_ITEMS,
  GuideArticle: PricePerSqftGuideArticle,
  faqs: PPSF_FAQS,
  countryRules: null,
};
