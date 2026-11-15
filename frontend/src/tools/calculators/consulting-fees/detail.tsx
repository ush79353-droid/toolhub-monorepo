import type { ToolPageDetail } from '@/tools/page-detail';
import { ConsultingFeesGuideArticle } from './ConsultingFeesGuideArticle';
import { CONSULTING_FEES_FAQS, CONSULTING_FEES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily and hourly consulting rates from billable days, operating costs, and target income.',
  asideAriaLabel: 'Interactive Consulting Fees Calculator',
  tocItems: CONSULTING_FEES_TOC_ITEMS,
  GuideArticle: ConsultingFeesGuideArticle,
  faqs: CONSULTING_FEES_FAQS,
  countryRules: null,
};
