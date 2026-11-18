import type { ToolPageDetail } from '@/tools/page-detail';
import { RadiationGuideArticle } from './RadiationGuideArticle';
import { RADIATION_FAQS, RADIATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert absorbed dose (Gy, mGy, rad) and equivalent dose (µSv, mSv, rem) units. Gy and Sv stay independent.',
  asideAriaLabel: 'Interactive radiation converter',
  tocItems: RADIATION_TOC_ITEMS,
  GuideArticle: RadiationGuideArticle,
  faqs: RADIATION_FAQS,
  countryRules: null,
};
