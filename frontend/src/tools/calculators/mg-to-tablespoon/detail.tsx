import type { ToolPageDetail } from '@/tools/page-detail';
import { MgToTablespoonGuideArticle } from './MgToTablespoonGuideArticle';
import { MG_TO_TABLESPOON_FAQS, MG_TO_TABLESPOON_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milligrams to tablespoons using ingredient density. Calculate mg to tbsp and tbsp to mg for salt, water, cooking ingredients, and custom densities.',
  asideAriaLabel: 'Interactive milligrams to tablespoons converter',
  tocItems: MG_TO_TABLESPOON_TOC_ITEMS,
  GuideArticle: MgToTablespoonGuideArticle,
  faqs: MG_TO_TABLESPOON_FAQS,
  countryRules: null,
};
