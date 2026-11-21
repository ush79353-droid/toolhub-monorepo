import type { ToolPageDetail } from '@/tools/page-detail';
import { NavyBodyFatGuideArticle } from './NavyBodyFatGuideArticle';
import { NAVY_BODY_FAT_FAQS, NAVY_BODY_FAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate percent body fat with the classic U.S. Navy circumference equations (Hodgdon & Beckett / NHRC). Educational only — not an official Navy BCA score.',
  asideAriaLabel: 'Interactive Navy Body Fat Calculator',
  tocItems: NAVY_BODY_FAT_TOC_ITEMS,
  GuideArticle: NavyBodyFatGuideArticle,
  faqs: NAVY_BODY_FAT_FAQS,
  countryRules: null,
};
