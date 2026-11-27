import type { ToolPageDetail } from '@/tools/page-detail';
import { RbcIndicesGuideArticle } from './RbcIndicesGuideArticle';
import { RBC_INDICES_FAQS, RBC_INDICES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate MCH, MCHC, and MCV from hemoglobin, hematocrit, and RBC count — educational only.',
  asideAriaLabel: 'Interactive RBC Indices Calculator',
  tocItems: RBC_INDICES_TOC_ITEMS,
  GuideArticle: RbcIndicesGuideArticle,
  faqs: RBC_INDICES_FAQS,
  countryRules: null,
};
