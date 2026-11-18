import type { ToolPageDetail } from '@/tools/page-detail';
import { EidlGuideArticle } from './EidlGuideArticle';
import { EIDL_FAQS, EIDL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical program information and guidance regarding the concluded U.S. SBA Economic Injury Disaster Loan (EIDL) Emergency Advance initiative.',
  asideAriaLabel: 'Historical EIDL Emergency Advance Program Notice',
  tocItems: EIDL_TOC_ITEMS,
  GuideArticle: EidlGuideArticle,
  faqs: EIDL_FAQS,
};
