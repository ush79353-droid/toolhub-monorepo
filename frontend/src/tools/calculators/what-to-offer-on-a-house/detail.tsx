import type { ToolPageDetail } from '@/tools/page-detail';
import { WhatToOfferGuideArticle } from './WhatToOfferGuideArticle';
import { WHAT_TO_OFFER_FAQS, WHAT_TO_OFFER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a simplified house offer from fair market value minus renovation cost, desired discount, and desired profit, with clear warnings when assumptions produce a zero or negative offer.',
  asideAriaLabel: 'Interactive What To Offer On A House Calculator',
  tocItems: WHAT_TO_OFFER_TOC_ITEMS,
  GuideArticle: WhatToOfferGuideArticle,
  faqs: WHAT_TO_OFFER_FAQS,
  countryRules: null,
};
