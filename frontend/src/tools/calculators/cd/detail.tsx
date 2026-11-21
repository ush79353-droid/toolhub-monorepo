import type { ToolPageDetail } from '@/tools/page-detail';
import { CD_FAQS, CD_TOC_ITEMS } from './content';
import { CdGuideArticle } from './CdGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Certificate of Deposit maturity value, compound interest, effective APY, and a simplified after-tax interest estimate. Currency changes formatting only.',
  asideAriaLabel: 'CD Calculator guide',
  tocItems: CD_TOC_ITEMS,
  GuideArticle: CdGuideArticle,
  faqs: CD_FAQS,
  countryRules: null,
};
