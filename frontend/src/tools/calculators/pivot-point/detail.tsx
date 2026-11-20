import type { ToolPageDetail } from '@/tools/page-detail';
import { PivotPointGuideArticle } from './PivotPointGuideArticle';
import { PP_FAQS, PP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Classic, Woodie, Camarilla, Fibonacci, and DeMark pivot points with support and resistance levels from prior high, low, and close.',
  asideAriaLabel: 'Interactive Pivot Point Calculator',
  tocItems: PP_TOC_ITEMS,
  GuideArticle: PivotPointGuideArticle,
  faqs: PP_FAQS,
  countryRules: null,
};
