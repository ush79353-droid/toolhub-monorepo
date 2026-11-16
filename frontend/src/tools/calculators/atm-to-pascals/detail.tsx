import type { ToolPageDetail } from '@/tools/page-detail';
import { AtmToPascalsGuideArticle } from './AtmToPascalsGuideArticle';
import { ATM_TO_PASCALS_FAQS, ATM_TO_PASCALS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert atmospheres to pascals and pascals to atmospheres instantly using the exact factor 1 atm = 101,325 Pa.',
  asideAriaLabel: 'Interactive atm to pascals converter',
  tocItems: ATM_TO_PASCALS_TOC_ITEMS,
  GuideArticle: AtmToPascalsGuideArticle,
  faqs: ATM_TO_PASCALS_FAQS,
  countryRules: null,
};
