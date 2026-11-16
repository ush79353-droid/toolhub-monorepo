import type { ToolPageDetail } from '@/tools/page-detail';
import { PenniesToDollarsGuideArticle } from './PenniesToDollarsGuideArticle';
import { PENNIES_TO_DOLLARS_FAQS, PENNIES_TO_DOLLARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US pennies to dollars and dollars to pennies. 100 pennies = $1 — face value only, no FX.',
  asideAriaLabel: 'Interactive pennies to dollars calculator',
  tocItems: PENNIES_TO_DOLLARS_TOC_ITEMS,
  GuideArticle: PenniesToDollarsGuideArticle,
  faqs: PENNIES_TO_DOLLARS_FAQS,
  countryRules: null,
};
