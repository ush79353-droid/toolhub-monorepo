import type { ToolPageDetail } from '@/tools/page-detail';
import { NewYorkTaxGuideArticle } from './NewYorkTaxGuideArticle';
import { NEW_YORK_TAX_FAQS, NEW_YORK_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate federal, New York State, and NYC income tax from AGI, fixed USD educational estimate for tax year 2025.',
  asideAriaLabel: 'Interactive New York Tax Calculator',
  tocItems: NEW_YORK_TAX_TOC_ITEMS,
  GuideArticle: NewYorkTaxGuideArticle,
  faqs: NEW_YORK_TAX_FAQS,
  countryRules: null,
};