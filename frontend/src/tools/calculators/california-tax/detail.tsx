import type { ToolPageDetail } from '@/tools/page-detail';
import { CaliforniaTaxGuideArticle } from './CaliforniaTaxGuideArticle';
import { CALIFORNIA_TAX_FAQS, CALIFORNIA_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate California income tax, federal tax, employee payroll taxes, and county property tax from AGI and assessed value—fixed USD educational estimate.',
  asideAriaLabel: 'Interactive California Tax Calculator',
  tocItems: CALIFORNIA_TAX_TOC_ITEMS,
  GuideArticle: CaliforniaTaxGuideArticle,
  faqs: CALIFORNIA_TAX_FAQS,
  countryRules: null,
};
