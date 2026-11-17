import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginCalculatorClassicGuideArticle } from './MarginCalculatorClassicGuideArticle';
import {
  MARGIN_CALCULATOR_CLASSIC_FAQS,
  MARGIN_CALCULATOR_CLASSIC_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve cost, margin, revenue, and profit bidirectionally with a margin pin and real FX on money fields.',
  asideAriaLabel: 'Interactive Margin Calculator Classic',
  tocItems: MARGIN_CALCULATOR_CLASSIC_TOC_ITEMS,
  GuideArticle: MarginCalculatorClassicGuideArticle,
  faqs: MARGIN_CALCULATOR_CLASSIC_FAQS,
  countryRules: null,
};
