import type { ToolPageDetail } from '@/tools/page-detail';
import { PenceToPoundsGuideArticle } from './PenceToPoundsGuideArticle';
import { PENCE_TO_POUNDS_FAQS, PENCE_TO_POUNDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pence sterling (GBX) to pounds sterling (GBP) and back instantly. Fixed rule: 100 pence = 1 pound — not a live FX rate.',
  asideAriaLabel: 'Interactive Pence to Pounds Converter',
  tocItems: PENCE_TO_POUNDS_TOC_ITEMS,
  GuideArticle: PenceToPoundsGuideArticle,
  faqs: PENCE_TO_POUNDS_FAQS,
  countryRules: null,
};
