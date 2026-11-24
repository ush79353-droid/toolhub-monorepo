import type { ToolPageDetail } from '@/tools/page-detail';
import { MacroGuideArticle } from './MacroGuideArticle';
import { MACRO_FAQS, MACRO_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational calorie and macro split from Mifflin–St Jeor + AMDR — shared IIFYM model.',
  asideAriaLabel: 'Interactive Macro Calculator',
  tocItems: MACRO_TOC,
  GuideArticle: MacroGuideArticle,
  faqs: MACRO_FAQS,
  countryRules: null,
};
