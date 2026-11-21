import type { ToolPageDetail } from '@/tools/page-detail';
import { ProductivityGuideArticle } from './ProductivityGuideArticle';
import { PRODUCTIVITY_FAQS, PRODUCTIVITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure labor productivity as revenue per employee and revenue per working hour for the same reporting period.',
  asideAriaLabel: 'Interactive Productivity Calculator',
  tocItems: PRODUCTIVITY_TOC_ITEMS,
  GuideArticle: ProductivityGuideArticle,
  faqs: PRODUCTIVITY_FAQS,
  countryRules: null,
};
