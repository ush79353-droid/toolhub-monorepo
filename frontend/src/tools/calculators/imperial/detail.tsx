import type { ToolPageDetail } from '@/tools/page-detail';
import { ImperialGuideArticle } from './ImperialGuideArticle';
import { IMPERIAL_FAQS, IMPERIAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Imperial and US customary units to metric — length, area, volume, mass, and temperature — with exact shared conversion factors.',
  asideAriaLabel: 'Interactive imperial calculator',
  tocItems: IMPERIAL_TOC_ITEMS,
  GuideArticle: ImperialGuideArticle,
  faqs: IMPERIAL_FAQS,
  countryRules: null,
};
