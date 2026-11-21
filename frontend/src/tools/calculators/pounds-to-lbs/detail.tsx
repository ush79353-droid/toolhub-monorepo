import type { ToolPageDetail } from '@/tools/page-detail';
import { PoundsToLbsGuideArticle } from './PoundsToLbsGuideArticle';
import { POUNDS_TO_LBS_FAQS, POUNDS_TO_LBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Confirm that pounds and lbs are the same mass unit. 1 pound = 1 lb exactly; no factor other than 1.',
  asideAriaLabel: 'Interactive pounds to lbs converter',
  tocItems: POUNDS_TO_LBS_TOC_ITEMS,
  GuideArticle: PoundsToLbsGuideArticle,
  faqs: POUNDS_TO_LBS_FAQS,
  countryRules: null,
};
