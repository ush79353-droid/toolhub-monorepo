import type { ToolPageDetail } from '@/tools/page-detail';
import { CarbCalculatorGuideArticle } from './CarbCalculatorGuideArticle';
import { CARB_CALCULATOR_FAQS, CARB_CALCULATOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Carbohydrate grams from daily calories and AMDR-style shares, with optional Mifflin–St Jeor maintenance.',
  asideAriaLabel: 'Interactive Carb Calculator (Carbohydrates)',
  tocItems: CARB_CALCULATOR_TOC_ITEMS,
  GuideArticle: CarbCalculatorGuideArticle,
  faqs: CARB_CALCULATOR_FAQS,
  countryRules: null,
};