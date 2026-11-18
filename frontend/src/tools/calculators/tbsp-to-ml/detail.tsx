import type { ToolPageDetail } from '@/tools/page-detail';
import { TbspToMlGuideArticle } from './TbspToMlGuideArticle';
import { TBSPML_FAQS, TBSPML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert tablespoons to milliliters instantly. Choose US, metric, or Australian tablespoon standards.',
  asideAriaLabel: 'Interactive tbsp to mL converter',
  tocItems: TBSPML_TOC_ITEMS,
  GuideArticle: TbspToMlGuideArticle,
  faqs: TBSPML_FAQS,
  countryRules: null,
};
