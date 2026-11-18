import type { ToolPageDetail } from '@/tools/page-detail';
import { WeeksToMonthsGuideArticle } from './WeeksToMonthsGuideArticle';
import { W2M_FAQS, W2M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert weeks to months and months to weeks using an average Gregorian month of ≈ 4.348125 weeks.',
  asideAriaLabel: 'Interactive weeks to months calculator',
  tocItems: W2M_TOC_ITEMS,
  GuideArticle: WeeksToMonthsGuideArticle,
  faqs: W2M_FAQS,
  countryRules: null,
};
