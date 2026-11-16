import type { ToolPageDetail } from '@/tools/page-detail';
import { DbmToWattsGuideArticle } from './DbmToWattsGuideArticle';
import { DBM_TO_WATTS_FAQS, DBM_TO_WATTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert dBm to watts or milliwatts, and watts or milliwatts back to dBm. Logarithmic RF power levels referenced to 1 mW.',
  asideAriaLabel: 'Interactive dBm to watts calculator',
  tocItems: DBM_TO_WATTS_TOC_ITEMS,
  GuideArticle: DbmToWattsGuideArticle,
  faqs: DBM_TO_WATTS_FAQS,
  countryRules: null,
};
