import type { ToolPageDetail } from '@/tools/page-detail';
import { FenaGuideArticle } from './FenaGuideArticle';
import { FENA_FAQS, FENA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FENa from paired serum and urine sodium and creatinine — not an AKI diagnosis.',
  asideAriaLabel: 'Interactive FENa Calculator',
  tocItems: FENA_TOC_ITEMS,
  GuideArticle: FenaGuideArticle,
  faqs: FENA_FAQS,
  countryRules: null,
};
