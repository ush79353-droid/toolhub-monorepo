import type { ToolPageDetail } from '@/tools/page-detail';
import { BeeCalculatorGuideArticle } from './BeeCalculatorGuideArticle';
import { BEE_CALCULATOR_FAQS, BEE_CALCULATOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Basal energy expenditure (revised Harris–Benedict) and total energy expenditure with activity, stress, and temperature factors.',
  asideAriaLabel: 'Interactive BEE Calculator',
  tocItems: BEE_CALCULATOR_TOC_ITEMS,
  GuideArticle: BeeCalculatorGuideArticle,
  faqs: BEE_CALCULATOR_FAQS,
  countryRules: null,
};