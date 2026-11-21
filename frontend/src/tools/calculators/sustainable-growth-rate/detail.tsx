import type { ToolPageDetail } from '@/tools/page-detail';
import { SustainableGrowthRateGuideArticle } from './SustainableGrowthRateGuideArticle';
import { SGR_FAQS, SGR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate sustainable growth rate (SGR) from retention ratio and return on equity, with optional average equity or direct ROE × retention inputs.',
  asideAriaLabel: 'Interactive Sustainable Growth Rate Calculator',
  tocItems: SGR_TOC_ITEMS,
  GuideArticle: SustainableGrowthRateGuideArticle,
  faqs: SGR_FAQS,
  countryRules: null,
};
