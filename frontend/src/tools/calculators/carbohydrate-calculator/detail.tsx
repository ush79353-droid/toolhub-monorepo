import type { ToolPageDetail } from '@/tools/page-detail';
import { CarbohydrateCalculatorGuideArticle } from './CarbohydrateCalculatorGuideArticle';
import {
  CARBOHYDRATE_CALCULATOR_FAQS,
  CARBOHYDRATE_CALCULATOR_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily carbohydrate intake from maintenance calories and AMDR-style energy shares.',
  asideAriaLabel: 'Interactive Carbohydrate Calculator',
  tocItems: CARBOHYDRATE_CALCULATOR_TOC_ITEMS,
  GuideArticle: CarbohydrateCalculatorGuideArticle,
  faqs: CARBOHYDRATE_CALCULATOR_FAQS,
  countryRules: null,
};