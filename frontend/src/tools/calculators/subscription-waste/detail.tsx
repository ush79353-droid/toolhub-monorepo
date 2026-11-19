import type { ToolPageDetail } from '@/tools/page-detail';
import { SubscriptionWasteGuideArticle } from './SubscriptionWasteGuideArticle';
import {
  SUBSCRIPTION_WASTE_FAQS,
  SUBSCRIPTION_WASTE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Track recurring subscriptions by category, normalize billing to monthly, and estimate potential savings from cancellations. Currency changes formatting only.',
  asideAriaLabel: 'Subscription Waste Calculator guide',
  tocItems: SUBSCRIPTION_WASTE_TOC_ITEMS,
  GuideArticle: SubscriptionWasteGuideArticle,
  faqs: SUBSCRIPTION_WASTE_FAQS,
  countryRules: null,
};
