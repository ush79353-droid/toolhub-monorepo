import type { ToolPageDetail } from '@/tools/page-detail';
import { EconomicValueAddedGuideArticle } from './EconomicValueAddedGuideArticle';
import { EVA_FAQS, EVA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Economic Value Added (EVA) from NOPAT, invested capital, and WACC — profit after the cost of capital.',
  asideAriaLabel: 'Interactive Economic Value Added Calculator',
  tocItems: EVA_TOC_ITEMS,
  GuideArticle: EconomicValueAddedGuideArticle,
  faqs: EVA_FAQS,
  countryRules: null,
};
