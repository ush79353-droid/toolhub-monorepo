import type { ToolPageDetail } from '@/tools/page-detail';
import { PresentValueGuideArticle } from './PresentValueGuideArticle';
import { PRESENT_VALUE_FAQS, PRESENT_VALUE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Discount a future amount to today’s value using a per-period interest rate and number of periods.',
  asideAriaLabel: 'Interactive Present Value Calculator',
  tocItems: PRESENT_VALUE_TOC_ITEMS,
  GuideArticle: PresentValueGuideArticle,
  faqs: PRESENT_VALUE_FAQS,
  countryRules: null,
};
