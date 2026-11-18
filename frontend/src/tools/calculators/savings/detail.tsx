import type { ToolPageDetail } from '@/tools/page-detail';
import { SavingsGuideArticle } from './SavingsGuideArticle';
import { SAVINGS_FAQS, SAVINGS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project a future savings balance with compound interest, APY conversion, recurring deposits, and optional inflation adjustment.',
  asideAriaLabel: 'Interactive savings calculator',
  tocItems: SAVINGS_TOC_ITEMS,
  GuideArticle: SavingsGuideArticle,
  faqs: SAVINGS_FAQS,
  countryRules: null,
};
