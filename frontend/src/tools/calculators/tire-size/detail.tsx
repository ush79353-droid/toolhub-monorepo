import type { ToolPageDetail } from '@/tools/page-detail';
import { TireSizeGuideArticle } from './TireSizeGuideArticle';
import { TS_FAQS, TS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate tire diameter, sidewall height, and circumference from sidewall markings, and compare replacement sizes with theoretical speedometer estimates.',
  asideAriaLabel: 'Interactive Tire Size Calculator',
  tocItems: TS_TOC_ITEMS,
  GuideArticle: TireSizeGuideArticle,
  faqs: TS_FAQS,
  countryRules: null,
};
