import type { ToolPageDetail } from '@/tools/page-detail';
import { GoodwillGuideArticle } from './GoodwillGuideArticle';
import { GOODWILL_FAQS, GOODWILL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate simplified acquisition goodwill — Purchase price minus the fair value of identifiable net assets (assets − liabilities).',
  asideAriaLabel: 'Interactive Goodwill Calculator',
  tocItems: GOODWILL_TOC_ITEMS,
  GuideArticle: GoodwillGuideArticle,
  faqs: GOODWILL_FAQS,
  countryRules: null,
};
