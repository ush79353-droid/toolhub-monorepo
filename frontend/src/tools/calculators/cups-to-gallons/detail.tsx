import type { ToolPageDetail } from '@/tools/page-detail';
import { CupsToGalGuideArticle } from './CupsToGalGuideArticle';
import { CUPS_TO_GAL_FAQS, CUPS_TO_GAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cups to gallons — and back — with US customary, US legal, metric, and UK cups plus US or UK gallons.',
  asideAriaLabel: 'Interactive cups to gallons converter',
  tocItems: CUPS_TO_GAL_TOC_ITEMS,
  GuideArticle: CupsToGalGuideArticle,
  faqs: CUPS_TO_GAL_FAQS,
  countryRules: null,
};
