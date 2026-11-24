import type { ToolPageDetail } from '@/tools/page-detail';
import { WellsPeGuideArticle } from './WellsPeGuideArticle';
import { WELLS_PE_FAQS, WELLS_PE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Wells PE pretest score with two- and three-level probability bands. Classifications support evaluation and cannot independently rule out PE.',
  asideAriaLabel: 'Interactive Wells Score Calculator for Pulmonary Embolism',
  tocItems: WELLS_PE_TOC_ITEMS,
  GuideArticle: WellsPeGuideArticle,
  faqs: WELLS_PE_FAQS,
  countryRules: null,
};
