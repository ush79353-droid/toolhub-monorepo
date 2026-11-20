import type { ToolPageDetail } from '@/tools/page-detail';
import { SellingLeaveDaysGuideArticle } from './SellingLeaveDaysGuideArticle';
import {
  SELLING_LEAVE_DAYS_FAQS,
  SELLING_LEAVE_DAYS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate cash from selling unused paid leave days using your annual, monthly, weekly, or hourly base pay — with independent currency conversion on pay and payout.',
  asideAriaLabel: 'Interactive Selling Leave Days Calculator',
  tocItems: SELLING_LEAVE_DAYS_TOC_ITEMS,
  GuideArticle: SellingLeaveDaysGuideArticle,
  faqs: SELLING_LEAVE_DAYS_FAQS,
  countryRules: null,
};
