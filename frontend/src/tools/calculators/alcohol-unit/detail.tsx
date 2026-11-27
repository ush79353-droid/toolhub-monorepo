import type { ToolPageDetail } from '@/tools/page-detail';
import { AlcoholUnitGuideArticle } from './AlcoholUnitGuideArticle';
import { ALCOHOL_UNIT_FAQS, ALCOHOL_UNIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational UK alcohol units and country standard-drink conversion from documented servings — not BAC or fitness-to-drive advice.',
  asideAriaLabel: 'Interactive Alcohol Unit Calculator',
  tocItems: ALCOHOL_UNIT_TOC_ITEMS,
  GuideArticle: AlcoholUnitGuideArticle,
  faqs: ALCOHOL_UNIT_FAQS,
  countryRules: null,
};
