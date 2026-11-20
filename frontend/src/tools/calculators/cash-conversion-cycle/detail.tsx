import type { ToolPageDetail } from '@/tools/page-detail';
import { CashConversionCycleGuideArticle } from './CashConversionCycleGuideArticle';
import { CCC_FAQS, CCC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long cash stays tied up in inventory and receivables after supplier payment days — CCC = DIO + DSO − DPO — with optional beginning/ending averages for inventory, AR, and AP.',
  asideAriaLabel: 'Interactive Cash Conversion Cycle Calculator',
  tocItems: CCC_TOC_ITEMS,
  GuideArticle: CashConversionCycleGuideArticle,
  faqs: CCC_FAQS,
  countryRules: null,
};
