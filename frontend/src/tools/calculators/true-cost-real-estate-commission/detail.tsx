import type { ToolPageDetail } from '@/tools/page-detail';
import { TrueCostRealEstateCommissionGuideArticle } from './TrueCostRealEstateCommissionGuideArticle';
import {
  TRUE_COST_RE_COMMISSION_FAQS,
  TRUE_COST_RE_COMMISSION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See how seller and buyer commissions embedded in a financed purchase raise the real long-term cost beyond the headline percentage.',
  asideAriaLabel: 'Interactive True Cost of Real Estate Commission Calculator',
  tocItems: TRUE_COST_RE_COMMISSION_TOC_ITEMS,
  GuideArticle: TrueCostRealEstateCommissionGuideArticle,
  faqs: TRUE_COST_RE_COMMISSION_FAQS,
  countryRules: null,
};
