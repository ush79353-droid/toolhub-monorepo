import type { ToolPageDetail } from '@/tools/page-detail';
import { BeltSizeGuideArticle } from './BeltSizeGuideArticle';
import { BELT_SIZE_FAQS, BELT_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find a recommended belt size from waist circumference, clothing size, or an existing belt — with inch and centimeter conversions.',
  asideAriaLabel: 'Interactive Belt Size Calculator',
  tocItems: BELT_SIZE_TOC_ITEMS,
  GuideArticle: BeltSizeGuideArticle,
  faqs: BELT_SIZE_FAQS,
  countryRules: null,
};
