import type { ToolPageDetail } from '@/tools/page-detail';
import { NetEffectiveRentGuideArticle } from './NetEffectiveRentGuideArticle';
import { NET_EFFECTIVE_RENT_FAQS, NET_EFFECTIVE_RENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly and annual net effective rent after concessions and operating costs, with real FX on money fields.',
  asideAriaLabel: 'Interactive Net Effective Rent Calculator',
  tocItems: NET_EFFECTIVE_RENT_TOC_ITEMS,
  GuideArticle: NetEffectiveRentGuideArticle,
  faqs: NET_EFFECTIVE_RENT_FAQS,
  countryRules: null,
};
