import type { ToolPageDetail } from '@/tools/page-detail';
import { CustomerAcquisitionCostGuideArticle } from './CustomerAcquisitionCostGuideArticle';
import { CAC_FAQS, CAC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Divide marketing plus sales cost by new customers to estimate customer acquisition cost (CAC). Currency changes the denomination only.',
  asideAriaLabel: 'Interactive customer acquisition cost calculator',
  tocItems: CAC_TOC_ITEMS,
  GuideArticle: CustomerAcquisitionCostGuideArticle,
  faqs: CAC_FAQS,
  countryRules: null,
};
