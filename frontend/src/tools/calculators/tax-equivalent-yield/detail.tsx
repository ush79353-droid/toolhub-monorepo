import type { ToolPageDetail } from '@/tools/page-detail';
import { TaxEquivalentYieldGuideArticle } from './TaxEquivalentYieldGuideArticle';
import {
  TAX_EQUIVALENT_YIELD_FAQS,
  TAX_EQUIVALENT_YIELD_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the taxable equivalent yield of a tax-exempt bond using its annual yield and your marginal income tax rate.',
  asideAriaLabel: 'Interactive Tax Equivalent Yield Calculator',
  tocItems: TAX_EQUIVALENT_YIELD_TOC_ITEMS,
  GuideArticle: TaxEquivalentYieldGuideArticle,
  faqs: TAX_EQUIVALENT_YIELD_FAQS,
  countryRules: null,
};
