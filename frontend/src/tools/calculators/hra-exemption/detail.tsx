import type { ToolPageDetail } from '@/tools/page-detail';
import { HraGuideArticle } from './HraGuideArticle';
import { HRA_FAQS, HRA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate tax-free and taxable House Rent Allowance using salary, rent, city classification, tax year, and old vs new regime rules.',
  asideAriaLabel: 'Interactive HRA Exemption Calculator',
  tocItems: HRA_TOC_ITEMS,
  GuideArticle: HraGuideArticle,
  faqs: HRA_FAQS,
  countryRules: null,
};
