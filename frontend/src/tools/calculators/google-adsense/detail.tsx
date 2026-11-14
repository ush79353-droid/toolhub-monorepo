import type { ToolPageDetail } from '@/tools/page-detail';
import { GoogleAdsenseGuideArticle } from './GoogleAdsenseGuideArticle';
import { ADSENSE_FAQS, ADSENSE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate daily AdSense impressions, clicks, and revenue.',
  asideAriaLabel: 'Interactive Google AdSense Calculator',
  tocItems: ADSENSE_TOC_ITEMS,
  GuideArticle: GoogleAdsenseGuideArticle,
  faqs: ADSENSE_FAQS,
  countryRules: null,
};
