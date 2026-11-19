import type { ToolPageDetail } from '@/tools/page-detail';
import { POWERBALL_FAQS, POWERBALL_TOC_ITEMS } from './content';
import { PowerballGuideArticle } from './PowerballGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Powerball lump-sum and 30-payment annuity take-home amounts after federal and state tax estimates. Estimates only—not official lottery results.',
  asideAriaLabel: 'Powerball Calculator guide',
  tocItems: POWERBALL_TOC_ITEMS,
  GuideArticle: PowerballGuideArticle,
  faqs: POWERBALL_FAQS,
  countryRules: null,
};
