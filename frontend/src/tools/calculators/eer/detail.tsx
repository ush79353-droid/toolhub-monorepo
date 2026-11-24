import type { ToolPageDetail } from '@/tools/page-detail';
import { EerCalculatorGuideArticle } from './EerCalculatorGuideArticle';
import { EER_CALCULATOR_FAQS, EER_CALCULATOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Adult Estimated Energy Requirement (IOM DRI 2002/2005) from sex, age, height, weight, and physical activity — with educational pregnancy and lactation offsets.',
  asideAriaLabel: 'Interactive EER Calculator',
  tocItems: EER_CALCULATOR_TOC_ITEMS,
  GuideArticle: EerCalculatorGuideArticle,
  faqs: EER_CALCULATOR_FAQS,
  countryRules: null,
};
