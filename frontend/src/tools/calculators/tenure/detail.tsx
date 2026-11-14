import type { ToolPageDetail } from '@/tools/page-detail';
import { TenureGuideArticle } from './TenureGuideArticle';
import { TENURE_FAQS, TENURE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate average workforce tenure from combined service and headcount, or the calendar duration between two dates.',
  asideAriaLabel: 'Interactive tenure calculator',
  tocItems: TENURE_TOC_ITEMS,
  GuideArticle: TenureGuideArticle,
  faqs: TENURE_FAQS,
  countryRules: null,
};
