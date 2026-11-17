import type { ToolPageDetail } from '@/tools/page-detail';
import { MgToTeaspoonGuideArticle } from './MgToTeaspoonGuideArticle';
import { MG_TO_TEASPOON_FAQS, MG_TO_TEASPOON_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milligrams to teaspoons using ingredient density. Calculate mg to tsp and tsp to mg for salt, water, cooking ingredients, and custom densities.',
  asideAriaLabel: 'Interactive milligrams to teaspoons converter',
  tocItems: MG_TO_TEASPOON_TOC_ITEMS,
  GuideArticle: MgToTeaspoonGuideArticle,
  faqs: MG_TO_TEASPOON_FAQS,
  countryRules: null,
};
