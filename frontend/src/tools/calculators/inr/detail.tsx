import type { ToolPageDetail } from '@/tools/page-detail';
import { InrGuideArticle } from './InrGuideArticle';
import { INR_FAQS, INR_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational WHO INR from patient PT, mean normal PT, and reagent ISI — not a laboratory report.',
  asideAriaLabel: 'Interactive INR Calculator',
  tocItems: INR_TOC,
  GuideArticle: InrGuideArticle,
  faqs: INR_FAQS,
  countryRules: null,
};
