import type { ToolPageDetail } from '@/tools/page-detail';
import { CupsToOzGuideArticle } from './CupsToOzGuideArticle';
import { CUPS_TO_OZ_FAQS, CUPS_TO_OZ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cups to fluid ounces (and back) with US, metric, and UK cups. Results are volume (fl oz), not weight ounces.',
  asideAriaLabel: 'Interactive cups to oz converter',
  tocItems: CUPS_TO_OZ_TOC_ITEMS,
  GuideArticle: CupsToOzGuideArticle,
  faqs: CUPS_TO_OZ_FAQS,
  countryRules: null,
};
