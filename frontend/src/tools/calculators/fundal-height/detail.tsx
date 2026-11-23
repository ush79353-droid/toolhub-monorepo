import type { ToolPageDetail } from '@/tools/page-detail';
import { FundalHeightGuideArticle } from './FundalHeightGuideArticle';
import { FUNDAL_HEIGHT_FAQS, FUNDAL_HEIGHT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational INTERGROWTH-21st symphysis–fundal height percentiles, dating, and optional Johnson weight estimate — not a growth diagnosis.',
  asideAriaLabel: 'Interactive Fundal Height Calculator',
  tocItems: FUNDAL_HEIGHT_TOC_ITEMS,
  GuideArticle: FundalHeightGuideArticle,
  faqs: FUNDAL_HEIGHT_FAQS,
  countryRules: null,
};
