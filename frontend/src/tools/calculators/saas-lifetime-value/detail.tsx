import type { ToolPageDetail } from '@/tools/page-detail';
import { SaasLifetimeValueGuideArticle } from './SaasLifetimeValueGuideArticle';
import { SAAS_LTV_FAQS, SAAS_LTV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate SaaS customer lifetime value from ARPA, gross margin, churn, and account expansion. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive SaaS lifetime value calculator',
  tocItems: SAAS_LTV_TOC_ITEMS,
  GuideArticle: SaasLifetimeValueGuideArticle,
  faqs: SAAS_LTV_FAQS,
  countryRules: null,
};
