import type { ToolPageDetail } from '@/tools/page-detail';
import { DsoGuideArticle } from './DsoGuideArticle';
import { DSO_FAQS, DSO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how many days you take to collect receivables: DSO = (Average AR / Sales) × days; with average AR from beginning and ending balances or a direct average.',
  asideAriaLabel: 'Interactive DSO Calculator',
  tocItems: DSO_TOC_ITEMS,
  GuideArticle: DsoGuideArticle,
  faqs: DSO_FAQS,
  countryRules: null,
};
