import type { ToolPageDetail } from '@/tools/page-detail';
import { ConversionRateGuideArticle } from './ConversionRateGuideArticle';
import { CONVERSION_RATE_FAQS, CONVERSION_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate conversion rate for ads, posts, links, or websites from total conversions and clicks or visits.',
  asideAriaLabel: 'Interactive conversion rate calculator',
  tocItems: CONVERSION_RATE_TOC_ITEMS,
  GuideArticle: ConversionRateGuideArticle,
  faqs: CONVERSION_RATE_FAQS,
  countryRules: null,
};
