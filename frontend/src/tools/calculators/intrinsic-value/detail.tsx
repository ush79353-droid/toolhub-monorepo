import type { ToolPageDetail } from '@/tools/page-detail';
import { IntrinsicValueGuideArticle } from './IntrinsicValueGuideArticle';
import { IV_FAQS, IV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate stock intrinsic value with the adjusted Benjamin Graham formula using EPS, expected growth, and corporate bond yield, then compare margin of safety.',
  asideAriaLabel: 'Interactive Intrinsic Value Calculator',
  tocItems: IV_TOC_ITEMS,
  GuideArticle: IntrinsicValueGuideArticle,
  faqs: IV_FAQS,
  countryRules: null,
};
