import type { ToolPageDetail } from '@/tools/page-detail';
import { AfterTaxCostOfDebtGuideArticle } from './AfterTaxCostOfDebtGuideArticle';
import {
  AFTER_TAX_COST_OF_DEBT_FAQS,
  AFTER_TAX_COST_OF_DEBT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the after-tax cost of debt from net and pre-tax income and the before-tax cost of debt, with real FX on income fields.',
  asideAriaLabel: 'Interactive After-tax Cost of Debt Calculator',
  tocItems: AFTER_TAX_COST_OF_DEBT_TOC_ITEMS,
  GuideArticle: AfterTaxCostOfDebtGuideArticle,
  faqs: AFTER_TAX_COST_OF_DEBT_FAQS,
  countryRules: null,
};
