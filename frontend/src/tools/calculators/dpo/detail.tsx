import type { ToolPageDetail } from '@/tools/page-detail';
import { DpoGuideArticle } from './DpoGuideArticle';
import { DPO_FAQS, DPO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how many days you take to pay suppliers — DPO = (Average AP / Purchases) × days — with purchases from inventory and COGS or entered directly.',
  asideAriaLabel: 'Interactive DPO Calculator',
  tocItems: DPO_TOC_ITEMS,
  GuideArticle: DpoGuideArticle,
  faqs: DPO_FAQS,
  countryRules: null,
};
