import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceToBookGuideArticle } from './PriceToBookGuideArticle';
import { PTB_FAQS, PTB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate book value per share and price-to-book ratio from stockholder equity, preferred equity, shares, and share price — with optional tangible book.',
  asideAriaLabel: 'Interactive Price to Book Ratio Calculator',
  tocItems: PTB_TOC_ITEMS,
  GuideArticle: PriceToBookGuideArticle,
  faqs: PTB_FAQS,
  countryRules: null,
};
