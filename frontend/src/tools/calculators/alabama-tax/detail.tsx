import type { ToolPageDetail } from '@/tools/page-detail';
import { AlabamaTaxGuideArticle } from './AlabamaTaxGuideArticle';
import { ALABAMA_TAX_FAQS, ALABAMA_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Alabama state income tax and selected local occupational taxes from AGI, filing status, dependents, and deductions—fixed USD educational estimate.',
  asideAriaLabel: 'Interactive Alabama Tax Calculator',
  tocItems: ALABAMA_TAX_TOC_ITEMS,
  GuideArticle: AlabamaTaxGuideArticle,
  faqs: ALABAMA_TAX_FAQS,
  countryRules: null,
};
