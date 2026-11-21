import type { ToolPageDetail } from '@/tools/page-detail';
import { PegRatioGuideArticle } from './PegRatioGuideArticle';
import { PEG_FAQS, PEG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the PEG ratio from price, EPS (or net earnings and shares), retention rate, and return on equity.',
  asideAriaLabel: 'Interactive PEG Ratio Calculator',
  tocItems: PEG_TOC_ITEMS,
  GuideArticle: PegRatioGuideArticle,
  faqs: PEG_FAQS,
  countryRules: null,
};
