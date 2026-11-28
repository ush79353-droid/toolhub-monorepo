import type { ToolPageDetail } from '@/tools/page-detail';
import { HatSizeGuideArticle } from './HatSizeGuideArticle';
import { HAT_SIZE_FAQS, HAT_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate adult and children\'s hat sizes using head circumference, with US, UK, EU, and international conversions.',
  asideAriaLabel: 'Interactive Hat Size Calculator',
  tocItems: HAT_SIZE_TOC_ITEMS,
  GuideArticle: HatSizeGuideArticle,
  faqs: HAT_SIZE_FAQS,
  countryRules: null,
};
