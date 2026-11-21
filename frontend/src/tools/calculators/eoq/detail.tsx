import type { ToolPageDetail } from '@/tools/page-detail';
import { EoqGuideArticle } from './EoqGuideArticle';
import { EOQ_FAQS, EOQ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate economic order quantity — EOQ = √(2 × Annual demand × Order cost ÷ Holding cost per unit) — with annual ordering and holding cost estimates.',
  asideAriaLabel: 'Interactive EOQ Calculator',
  tocItems: EOQ_TOC_ITEMS,
  GuideArticle: EoqGuideArticle,
  faqs: EOQ_FAQS,
  countryRules: null,
};
