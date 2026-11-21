import type { ToolPageDetail } from '@/tools/page-detail';
import { CupsToQuartsGuideArticle } from './CupsToQuartsGuideArticle';
import { CUPS_TO_QUARTS_FAQS, CUPS_TO_QUARTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cups to quarts (and back) with US, metric, and UK cups plus US liquid, US dry, and imperial quarts.',
  asideAriaLabel: 'Interactive cups to quarts converter',
  tocItems: CUPS_TO_QUARTS_TOC_ITEMS,
  GuideArticle: CupsToQuartsGuideArticle,
  faqs: CUPS_TO_QUARTS_FAQS,
  countryRules: null,
};
