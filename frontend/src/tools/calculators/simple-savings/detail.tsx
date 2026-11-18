import type { ToolPageDetail } from '@/tools/page-detail';
import { SimpleSavingsGuideArticle } from './SimpleSavingsGuideArticle';
import { SIMPLE_SAVINGS_FAQS, SIMPLE_SAVINGS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project a future savings balance with compound interest, APY conversion, recurring deposits, and optional inflation adjustment.',
  asideAriaLabel: 'Interactive Simple Savings Calculator',
  tocItems: SIMPLE_SAVINGS_TOC_ITEMS,
  GuideArticle: SimpleSavingsGuideArticle,
  faqs: SIMPLE_SAVINGS_FAQS,
  countryRules: null,
};
