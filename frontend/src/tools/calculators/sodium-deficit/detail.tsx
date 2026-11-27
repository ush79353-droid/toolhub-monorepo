import type { ToolPageDetail } from '@/tools/page-detail';
import { SodiumDeficitGuideArticle } from './SodiumDeficitGuideArticle';
import { SODIUM_DEFICIT_FAQS, SODIUM_DEFICIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate sodium deficit from demographic TBW and serum sodium — educational only.',
  asideAriaLabel: 'Interactive Sodium Deficit Calculator',
  tocItems: SODIUM_DEFICIT_TOC_ITEMS,
  GuideArticle: SodiumDeficitGuideArticle,
  faqs: SODIUM_DEFICIT_FAQS,
  countryRules: null,
};
