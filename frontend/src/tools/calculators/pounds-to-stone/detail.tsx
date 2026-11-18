import type { ToolPageDetail } from '@/tools/page-detail';
import { PoundsToStoneGuideArticle } from './PoundsToStoneGuideArticle';
import { POUNDS_TO_STONE_FAQS, POUNDS_TO_STONE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds to stone and stone to pounds instantly. Exact: 1 st = 14 lb.',
  asideAriaLabel: 'Interactive pounds to stone converter',
  tocItems: POUNDS_TO_STONE_TOC_ITEMS,
  GuideArticle: PoundsToStoneGuideArticle,
  faqs: POUNDS_TO_STONE_FAQS,
  countryRules: null,
};
