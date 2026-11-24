import type { ToolPageDetail } from '@/tools/page-detail';
import { AaGradientGuideArticle } from './AaGradientGuideArticle';
import { AA_GRADIENT_FAQS, AA_GRADIENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational alveolar–arterial oxygen gradient from the alveolar gas equation — not a diagnosis.',
  asideAriaLabel: 'Interactive Aa Gradient Calculator',
  tocItems: AA_GRADIENT_TOC_ITEMS,
  GuideArticle: AaGradientGuideArticle,
  faqs: AA_GRADIENT_FAQS,
  countryRules: null,
};
