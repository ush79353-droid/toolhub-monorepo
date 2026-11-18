import type { ToolPageDetail } from '@/tools/page-detail';
import { KpaToMmhgGuideArticle } from './KpaToMmhgGuideArticle';
import { KPA_TO_MMHG_FAQS, KPA_TO_MMHG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kPa to mmHg and mmHg to kPa instantly. Conventional: 101.325 kPa = 760 mmHg.',
  asideAriaLabel: 'Interactive kPa to mmHg converter',
  tocItems: KPA_TO_MMHG_TOC_ITEMS,
  GuideArticle: KpaToMmhgGuideArticle,
  faqs: KPA_TO_MMHG_FAQS,
  countryRules: null,
};
