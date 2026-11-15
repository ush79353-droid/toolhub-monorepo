import type { ToolPageDetail } from '@/tools/page-detail';
import { TtmGuideArticle } from './TtmGuideArticle';
import { TTM_FAQS, TTM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Sum four consecutive quarterly values into a trailing twelve-month figure.',
  asideAriaLabel: 'Interactive TTM Calculator',
  tocItems: TTM_TOC_ITEMS,
  GuideArticle: TtmGuideArticle,
  faqs: TTM_FAQS,
  countryRules: null,
};
