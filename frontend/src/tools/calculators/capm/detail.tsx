import type { ToolPageDetail } from '@/tools/page-detail';
import { CapmGuideArticle } from './CapmGuideArticle';
import { CAPM_FAQS, CAPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate expected return from risk-free rate, market return, and beta (CAPM).',
  asideAriaLabel: 'Interactive CAPM Calculator',
  tocItems: CAPM_TOC_ITEMS,
  GuideArticle: CapmGuideArticle,
  faqs: CAPM_FAQS,
  countryRules: null,
};
