import type { ToolPageDetail } from '@/tools/page-detail';
import { KpaToAtmGuideArticle } from './KpaToAtmGuideArticle';
import { KPA_TO_ATM_FAQS, KPA_TO_ATM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kPa to atm and atm to kPa instantly. Exact: 1 atm = 101.325 kPa.',
  asideAriaLabel: 'Interactive kPa to atm converter',
  tocItems: KPA_TO_ATM_TOC_ITEMS,
  GuideArticle: KpaToAtmGuideArticle,
  faqs: KPA_TO_ATM_FAQS,
  countryRules: null,
};
