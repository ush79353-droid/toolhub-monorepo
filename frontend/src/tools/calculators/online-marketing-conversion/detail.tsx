import type { ToolPageDetail } from '@/tools/page-detail';
import { OnlineMarketingConversionGuideArticle } from './OnlineMarketingConversionGuideArticle';
import { OMC_FAQS, OMC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Connect impressions, clicks, leads, and customers to campaign cost, revenue, and ROI; blanks fill without overwriting your inputs.',
  asideAriaLabel: 'Interactive online marketing conversion calculator',
  tocItems: OMC_TOC_ITEMS,
  GuideArticle: OnlineMarketingConversionGuideArticle,
  faqs: OMC_FAQS,
  countryRules: null,
};
