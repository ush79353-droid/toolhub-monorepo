import type { ToolPageDetail } from '@/tools/page-detail';
import { CpsGuideArticle } from './CpsGuideArticle';
import { CPS_FAQS, CPS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cycles per second to Hz, RPM, kHz, MHz, GHz, degrees per second, and radians per second.',
  asideAriaLabel: 'Interactive CPS calculator',
  tocItems: CPS_TOC_ITEMS,
  GuideArticle: CpsGuideArticle,
  faqs: CPS_FAQS,
  countryRules: null,
};
