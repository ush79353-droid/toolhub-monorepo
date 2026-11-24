import type { ToolPageDetail } from '@/tools/page-detail';
import { DrugHalfLifeGuideArticle } from './DrugHalfLifeGuideArticle';
import { DRUG_HALF_LIFE_FAQS, DRUG_HALF_LIFE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate remaining drug mass after successive half-life cycles using first-order elimination arithmetic.',
  asideAriaLabel: 'Interactive Drug Half-Life Calculator',
  tocItems: DRUG_HALF_LIFE_TOC_ITEMS,
  GuideArticle: DrugHalfLifeGuideArticle,
  faqs: DRUG_HALF_LIFE_FAQS,
  countryRules: null,
};
