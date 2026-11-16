import type { ToolPageDetail } from '@/tools/page-detail';
import { AtmConversionGuideArticle } from './AtmConversionGuideArticle';
import { ATM_CONVERSION_FAQS, ATM_CONVERSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert atmospheres to bar, psi, and pascals instantly using the exact standard atmosphere 1 atm = 101,325 Pa.',
  asideAriaLabel: 'Interactive ATM pressure conversion calculator',
  tocItems: ATM_CONVERSION_TOC_ITEMS,
  GuideArticle: AtmConversionGuideArticle,
  faqs: ATM_CONVERSION_FAQS,
  countryRules: null,
};
