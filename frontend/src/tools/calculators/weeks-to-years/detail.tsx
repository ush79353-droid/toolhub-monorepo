import type { ToolPageDetail } from '@/tools/page-detail';
import { WeeksToYearsGuideArticle } from './WeeksToYearsGuideArticle';
import { W2Y_FAQS, W2Y_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert weeks to years and years to weeks using an average Gregorian year of 365.2425 days (≈ 52.1775 weeks).',
  asideAriaLabel: 'Interactive weeks to years converter',
  tocItems: W2Y_TOC_ITEMS,
  GuideArticle: WeeksToYearsGuideArticle,
  faqs: W2Y_FAQS,
  countryRules: null,
};
