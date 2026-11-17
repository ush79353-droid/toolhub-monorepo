import type { ToolPageDetail } from '@/tools/page-detail';
import { KpaConverterGuideArticle } from './KpaConverterGuideArticle';
import { KPA_FAQS, KPA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kPa to bar, psi, and atm instantly. Exact: 1 bar = 100 kPa; 1 atm = 101.325 kPa.',
  asideAriaLabel: 'Interactive kPa converter',
  tocItems: KPA_TOC_ITEMS,
  GuideArticle: KpaConverterGuideArticle,
  faqs: KPA_FAQS,
  countryRules: null,
};
