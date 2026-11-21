import type { ToolPageDetail } from '@/tools/page-detail';
import { ForwardPremiumGuideArticle } from './ForwardPremiumGuideArticle';
import {
  FORWARD_PREMIUM_FAQS,
  FORWARD_PREMIUM_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute FX forward premium or discount from spot and forward rates, then annualize over the contract tenor on a 365-day basis.',
  asideAriaLabel: 'Interactive Forward Premium Calculator',
  tocItems: FORWARD_PREMIUM_TOC_ITEMS,
  GuideArticle: ForwardPremiumGuideArticle,
  faqs: FORWARD_PREMIUM_FAQS,
  countryRules: null,
};
