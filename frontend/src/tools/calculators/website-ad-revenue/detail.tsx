import type { ToolPageDetail } from '@/tools/page-detail';
import { WebsiteAdRevenueGuideArticle } from './WebsiteAdRevenueGuideArticle';
import { WEBSITE_AD_REVENUE_FAQS, WEBSITE_AD_REVENUE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate website ad revenue from visits and page RPM.',
  asideAriaLabel: 'Interactive Website Ad Revenue Calculator',
  tocItems: WEBSITE_AD_REVENUE_TOC_ITEMS,
  GuideArticle: WebsiteAdRevenueGuideArticle,
  faqs: WEBSITE_AD_REVENUE_FAQS,
  countryRules: null,
};
