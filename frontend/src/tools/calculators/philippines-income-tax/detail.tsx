import type { ToolPageDetail } from '@/tools/page-detail';
import { PhilippinesIncomeTaxGuideArticle } from './PhilippinesIncomeTaxGuideArticle';
import { PH_INCOME_TAX_FAQS, PH_INCOME_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate CY 2025 Philippines monthly take-home pay from SSS, PhilHealth, Pag-IBIG, and BIR withholding or graduated tax; fixed ₱, employed or self-employed.',
  asideAriaLabel: 'Interactive Income Tax Philippines Calculator',
  tocItems: PH_INCOME_TAX_TOC_ITEMS,
  GuideArticle: PhilippinesIncomeTaxGuideArticle,
  faqs: PH_INCOME_TAX_FAQS,
  countryRules: null,
};
