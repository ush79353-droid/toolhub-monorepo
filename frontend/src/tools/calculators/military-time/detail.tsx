import type { ToolPageDetail } from '@/tools/page-detail';
import { MilitaryTimeGuideArticle } from './MilitaryTimeGuideArticle';
import { MILITARY_FAQS, MILITARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert military time to 12-hour time and back. Four-digit 0000–2359 notation, midnight, and noon included.',
  asideAriaLabel: 'Interactive military time converter',
  tocItems: MILITARY_TOC_ITEMS,
  GuideArticle: MilitaryTimeGuideArticle,
  faqs: MILITARY_FAQS,
  countryRules: null,
};
