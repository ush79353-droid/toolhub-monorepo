import type { ToolPageDetail } from '@/tools/page-detail';
import { FfmiGuideArticle } from './FfmiGuideArticle';
import { FFMI_FAQS, FFMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational fat-free mass index from height, weight, and body-fat % — not a clinical body-composition report.',
  asideAriaLabel: 'Interactive FFMI Calculator',
  tocItems: FFMI_TOC_ITEMS,
  GuideArticle: FfmiGuideArticle,
  faqs: FFMI_FAQS,
  countryRules: null,
};
