import type { ToolPageDetail } from '@/tools/page-detail';
import { PomisGuideArticle } from './PomisGuideArticle';
import { POMIS_FAQS, POMIS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Post Office Monthly Income Scheme (POMIS) monthly interest, total earnings, investment limits, and maturity details in INR.',
  asideAriaLabel: 'Interactive POMIS Calculator',
  tocItems: POMIS_TOC_ITEMS,
  GuideArticle: PomisGuideArticle,
  faqs: POMIS_FAQS,
  countryRules: null,
};
