import type { ToolPageDetail } from '@/tools/page-detail';
import { StoneToLbsGuideArticle } from './StoneToLbsGuideArticle';
import { ST_TO_LB_FAQS, ST_TO_LB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert stones to pounds and pounds to stones instantly — exact 1 st = 14 lb, with kilograms and other mass units.',
  asideAriaLabel: 'Interactive stone to pounds converter',
  tocItems: ST_TO_LB_TOC_ITEMS,
  GuideArticle: StoneToLbsGuideArticle,
  faqs: ST_TO_LB_FAQS,
  countryRules: null,
};
