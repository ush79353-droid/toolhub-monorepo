import type { ToolPageDetail } from '@/tools/page-detail';
import { EarlyRetirementGuideArticle } from './EarlyRetirementGuideArticle';
import { ER_FAQS, ER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly savings capacity, the nest egg implied by your withdrawal rate, and how long end-of-month deposits take to reach financial independence. Currency changes formatting only.',
  asideAriaLabel: 'Interactive Early Retirement Calculator',
  tocItems: ER_TOC_ITEMS,
  GuideArticle: EarlyRetirementGuideArticle,
  faqs: ER_FAQS,
  countryRules: null,
};
