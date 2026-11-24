import type { ToolPageDetail } from '@/tools/page-detail';
import { TdeeGuideArticle } from './TdeeGuideArticle';
import { TDEE_FAQS, TDEE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Mifflin–St Jeor BMR × activity factor — educational TDEE estimate.',
  asideAriaLabel: 'Interactive TDEE Calculator',
  tocItems: TDEE_TOC,
  GuideArticle: TdeeGuideArticle,
  faqs: TDEE_FAQS,
  countryRules: null,
};
