import type { ToolPageDetail } from '@/tools/page-detail';
import { RentIncreaseGuideArticle } from './RentIncreaseGuideArticle';
import { RENT_INCREASE_FAQS, RENT_INCREASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project future annual rent from today’s rent, an average yearly percent change, and years — with real FX on money fields.',
  asideAriaLabel: 'Interactive Rent Increase Calculator',
  tocItems: RENT_INCREASE_TOC_ITEMS,
  GuideArticle: RentIncreaseGuideArticle,
  faqs: RENT_INCREASE_FAQS,
  countryRules: null,
};
