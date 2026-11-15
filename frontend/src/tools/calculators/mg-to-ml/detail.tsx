import type { ToolPageDetail } from '@/tools/page-detail';
import { MG_TO_ML_FAQS, MG_TO_ML_TOC_ITEMS } from './content';
import { MgToMlGuideArticle } from './MgToMlGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milligrams to milliliters using density or a known liquid concentration. Mass and volume are not interchangeable without that factor.',
  asideAriaLabel: 'Interactive mg to mL calculator',
  tocItems: MG_TO_ML_TOC_ITEMS,
  GuideArticle: MgToMlGuideArticle,
  faqs: MG_TO_ML_FAQS,
  countryRules: null,
};
