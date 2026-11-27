import type { ToolPageDetail } from '@/tools/page-detail';
import { SodiumChangeGuideArticle } from './SodiumChangeGuideArticle';
import { SODIUM_CHANGE_FAQS, SODIUM_CHANGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ΔNa from triglycerides for indirect ISE pseudohyponatremia — not a lab report or sodium order.',
  asideAriaLabel: 'Interactive Sodium Change Calculator in Hypertriglyceridemia',
  tocItems: SODIUM_CHANGE_TOC_ITEMS,
  GuideArticle: SodiumChangeGuideArticle,
  faqs: SODIUM_CHANGE_FAQS,
  countryRules: null,
};
