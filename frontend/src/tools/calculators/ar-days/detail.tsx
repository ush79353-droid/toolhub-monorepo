import type { ToolPageDetail } from '@/tools/page-detail';
import { ARDaysGuideArticle } from './ARDaysGuideArticle';
import { AR_DAYS_FAQS, AR_DAYS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate accounts receivable days from a receivables balance and net credit sales, or solve for one of the other inputs. Ending and average balances stay separate.',
  asideAriaLabel: 'Interactive A/R days calculator',
  tocItems: AR_DAYS_TOC_ITEMS,
  GuideArticle: ARDaysGuideArticle,
  faqs: AR_DAYS_FAQS,
  countryRules: null,
};
