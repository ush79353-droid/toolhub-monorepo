import type { ToolPageDetail } from '@/tools/page-detail';
import { CdGuideArticle } from './CdGuideArticle';
import { CD_FAQS, CD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate certificate of deposit final balance and interest earned with compound interest.',
  asideAriaLabel: 'Interactive CD calculator',
  tocItems: CD_TOC_ITEMS,
  GuideArticle: CdGuideArticle,
  faqs: CD_FAQS,
  countryRules: null,
};
