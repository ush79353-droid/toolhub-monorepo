import type { ToolPageDetail } from '@/tools/page-detail';
import { SwpGuideArticle } from './SwpGuideArticle';
import { SWP_FAQS, SWP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Plan systematic withdrawals: solve for initial investment, withdrawal amount, duration, final balance, or required return. Currency formats amounts only.',
  asideAriaLabel: 'Interactive SWP Calculator',
  tocItems: SWP_TOC_ITEMS,
  GuideArticle: SwpGuideArticle,
  faqs: SWP_FAQS,
  countryRules: null,
};
