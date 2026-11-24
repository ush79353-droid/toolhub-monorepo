import type { ToolPageDetail } from '@/tools/page-detail';
import { WarfarinDosingGuideArticle } from './WarfarinDosingGuideArticle';
import { WARFARIN_DOSING_FAQS, WARFARIN_DOSING_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational warfarin maintenance adjustment from published INR bands — not a prescription or reversal order.',
  asideAriaLabel: 'Interactive Warfarin Dosing Calculator',
  tocItems: WARFARIN_DOSING_TOC,
  GuideArticle: WarfarinDosingGuideArticle,
  faqs: WARFARIN_DOSING_FAQS,
  countryRules: null,
};
