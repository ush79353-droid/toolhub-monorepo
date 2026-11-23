import type { ToolPageDetail } from '@/tools/page-detail';
import { PercGuideArticle } from './PercGuideArticle';
import { PERC_FAQS, PERC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational PERC rule for low pretest probability PE workups. Counts positive criteria; rule-out wording only after low-risk and full assessment attestation.',
  asideAriaLabel: 'Interactive PERC Calculator',
  tocItems: PERC_TOC_ITEMS,
  GuideArticle: PercGuideArticle,
  faqs: PERC_FAQS,
  countryRules: null,
};