import type { ToolPageDetail } from '@/tools/page-detail';
import { WintersFormulaGuideArticle } from './WintersFormulaGuideArticle';
import { WINTERS_FORMULA_FAQS, WINTERS_FORMULA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Estimate expected compensatory pCO₂ in metabolic acidosis with Winters' formula — educational only.",
  asideAriaLabel: "Interactive Winters' Formula Calculator",
  tocItems: WINTERS_FORMULA_TOC_ITEMS,
  GuideArticle: WintersFormulaGuideArticle,
  faqs: WINTERS_FORMULA_FAQS,
  countryRules: null,
};
