import type { ToolPageDetail } from '@/tools/page-detail';
import { VaMortgageGuideArticle } from './VaMortgageGuideArticle';
import { VA_MORTGAGE_FAQS, VA_MORTGAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate VA mortgage payments with published funding-fee rates, disability exemption, and a principal-versus-interest chart.',
  asideAriaLabel: 'Interactive VA Mortgage Calculator',
  tocItems: VA_MORTGAGE_TOC_ITEMS,
  GuideArticle: VaMortgageGuideArticle,
  faqs: VA_MORTGAGE_FAQS,
  countryRules: null,
};
