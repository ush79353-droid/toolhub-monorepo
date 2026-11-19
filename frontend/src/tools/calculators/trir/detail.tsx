import type { ToolPageDetail } from '@/tools/page-detail';
import { TRIR_FAQS, TRIR_TOC_ITEMS } from './content';
import { TrirGuideArticle } from './TrirGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Total Recordable Incident Rate (TRIR) from OSHA-recordable cases and total hours worked using the standard 200,000-hour normalization factor.',
  asideAriaLabel: 'TRIR Calculator guide',
  tocItems: TRIR_TOC_ITEMS,
  GuideArticle: TrirGuideArticle,
  faqs: TRIR_FAQS,
  countryRules: null,
};
