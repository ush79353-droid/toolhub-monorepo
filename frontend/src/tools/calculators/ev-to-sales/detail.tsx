import type { ToolPageDetail } from '@/tools/page-detail';
import { EvToSalesGuideArticle } from './EvToSalesGuideArticle';
import { EV_TO_SALES_FAQS, EV_TO_SALES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Build enterprise value from market cap, debt, minority interest, preferred shares, and cash, then compute the EV to sales ratio with independent FX on each money field.',
  asideAriaLabel: 'Interactive EV to Sales Calculator',
  tocItems: EV_TO_SALES_TOC_ITEMS,
  GuideArticle: EvToSalesGuideArticle,
  faqs: EV_TO_SALES_FAQS,
  countryRules: null,
};
