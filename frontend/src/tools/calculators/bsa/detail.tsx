import type { ToolPageDetail } from '@/tools/page-detail';
import { BsaGuideArticle } from './BsaGuideArticle';
import { BSA_FAQS, BSA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate body surface area with Du Bois (primary) plus optional Mosteller and other formulas — educational only.',
  asideAriaLabel: 'Interactive BSA Calculator',
  tocItems: BSA_TOC_ITEMS,
  GuideArticle: BsaGuideArticle,
  faqs: BSA_FAQS,
  countryRules: null,
};
