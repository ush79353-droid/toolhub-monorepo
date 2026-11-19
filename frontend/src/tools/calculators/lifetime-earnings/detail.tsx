import type { ToolPageDetail } from '@/tools/page-detail';
import {
  LIFETIME_EARNINGS_FAQS,
  LIFETIME_EARNINGS_TOC_ITEMS,
} from './content';
import { LifetimeEarningsGuideArticle } from './LifetimeEarningsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate remaining working years and projected gross lifetime earnings from your current salary and expected annual raises. Currency changes formatting only.',
  asideAriaLabel: 'Lifetime Earnings Calculator guide',
  tocItems: LIFETIME_EARNINGS_TOC_ITEMS,
  GuideArticle: LifetimeEarningsGuideArticle,
  faqs: LIFETIME_EARNINGS_FAQS,
  countryRules: null,
};
