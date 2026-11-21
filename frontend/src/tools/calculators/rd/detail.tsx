import type { ToolPageDetail } from '@/tools/page-detail';
import { RdGuideArticle } from './RdGuideArticle';
import { RD_FAQS, RD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate recurring deposit maturity from monthly deposits, term, and annual interest rate using bank-style quarterly compounding, with independent FX on money fields.',
  asideAriaLabel: 'Interactive RD Calculator — Recurring Deposit',
  tocItems: RD_TOC_ITEMS,
  GuideArticle: RdGuideArticle,
  faqs: RD_FAQS,
  countryRules: null,
};
