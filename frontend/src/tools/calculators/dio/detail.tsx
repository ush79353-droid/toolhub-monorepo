import type { ToolPageDetail } from '@/tools/page-detail';
import { DioGuideArticle } from './DioGuideArticle';
import { DIO_FAQS, DIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how many days inventory stays on hand — DIO = (Average inventory / COGS) × days — with average inventory from starting and ending balances or a direct average.',
  asideAriaLabel: 'Interactive DIO Calculator',
  tocItems: DIO_TOC_ITEMS,
  GuideArticle: DioGuideArticle,
  faqs: DIO_FAQS,
  countryRules: null,
};
