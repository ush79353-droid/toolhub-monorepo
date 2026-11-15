import type { ToolPageDetail } from '@/tools/page-detail';
import { PaybackPeriodGuideArticle } from './PaybackPeriodGuideArticle';
import { PAYBACK_FAQS, PAYBACK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate simple and discounted payback for steady or irregular cash flows from an initial investment.',
  asideAriaLabel: 'Interactive payback period calculator',
  tocItems: PAYBACK_TOC_ITEMS,
  GuideArticle: PaybackPeriodGuideArticle,
  faqs: PAYBACK_FAQS,
  countryRules: null,
};
