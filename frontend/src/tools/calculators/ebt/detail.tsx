import type { ToolPageDetail } from '@/tools/page-detail';
import { EbtGuideArticle } from './EbtGuideArticle';
import { EBT_FAQS, EBT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate pretax earnings — EBT = Gross profit − Operating expenses − Interest + Other income — from revenue, COGS, SG&A, and D&A.',
  asideAriaLabel: 'Interactive EBT Calculator',
  tocItems: EBT_TOC_ITEMS,
  GuideArticle: EbtGuideArticle,
  faqs: EBT_FAQS,
  countryRules: null,
};
