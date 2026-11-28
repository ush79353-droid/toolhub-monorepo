import type { ToolPageDetail } from '@/tools/page-detail';
import { BikiniGuideArticle } from './BikiniGuideArticle';
import { BIKINI_FAQS, BIKINI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Explore body proportions and optional bikini styles using bust, waist, high-hip, and hip measurements — inclusive styling references, not beauty standards.',
  asideAriaLabel: 'Interactive Bikini Calculator',
  tocItems: BIKINI_TOC_ITEMS,
  GuideArticle: BikiniGuideArticle,
  faqs: BIKINI_FAQS,
  countryRules: null,
};
