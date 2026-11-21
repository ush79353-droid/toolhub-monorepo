import type { ToolPageDetail } from '@/tools/page-detail';
import { PakistanIncomeTaxGuideArticle } from './PakistanIncomeTaxGuideArticle';
import {
  PAKISTAN_INCOME_TAX_FAQS,
  PAKISTAN_INCOME_TAX_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Pakistan salaried income tax from monthly gross salary using verified FBR Tax Year 2027 progressive slabs (Finance Act, 2026), in fixed PKR.',
  asideAriaLabel: 'Interactive Income Tax Calculator Pakistan',
  tocItems: PAKISTAN_INCOME_TAX_TOC_ITEMS,
  GuideArticle: PakistanIncomeTaxGuideArticle,
  faqs: PAKISTAN_INCOME_TAX_FAQS,
  countryRules: null,
};
