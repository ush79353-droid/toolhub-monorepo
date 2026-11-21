import type { ToolPageDetail } from '@/tools/page-detail';
import { PppGuideArticle } from './PppGuideArticle';
import { PPP_FAQS, PPP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare purchasing power across countries, calculate equivalent salaries, and understand PPP exchange rates and relative price levels.',
  asideAriaLabel: 'Interactive PPP Calculator',
  tocItems: PPP_TOC_ITEMS,
  GuideArticle: PppGuideArticle,
  faqs: PPP_FAQS,
  countryRules: null,
};
