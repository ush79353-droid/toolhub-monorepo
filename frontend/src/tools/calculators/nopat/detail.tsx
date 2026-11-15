import type { ToolPageDetail } from '@/tools/page-detail';
import { NopatGuideArticle } from './NopatGuideArticle';
import { NOPAT_FAQS, NOPAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate net operating profit after tax with a simple operating-profit formula or a precise income-statement reconstruction.',
  asideAriaLabel: 'Interactive NOPAT Calculator',
  tocItems: NOPAT_TOC_ITEMS,
  GuideArticle: NopatGuideArticle,
  faqs: NOPAT_FAQS,
  countryRules: null,
};
