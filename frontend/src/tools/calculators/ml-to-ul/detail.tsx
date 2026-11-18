import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToUlGuideArticle } from './MlToUlGuideArticle';
import { MLUL_FAQS, MLUL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to microliters (µL / uL) with the exact factor 1 mL = 1,000 µL.',
  asideAriaLabel: 'Interactive mL to µL converter',
  tocItems: MLUL_TOC_ITEMS,
  GuideArticle: MlToUlGuideArticle,
  faqs: MLUL_FAQS,
  countryRules: null,
};
