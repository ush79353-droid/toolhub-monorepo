import type { ToolPageDetail } from '@/tools/page-detail';
import { CupsToPintsGuideArticle } from './CupsToPintsGuideArticle';
import { CUPS_TO_PINTS_FAQS, CUPS_TO_PINTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cups to pints — and back — with US, metric, and UK cups plus US liquid, US dry, and imperial pints.',
  asideAriaLabel: 'Interactive cups to pints converter',
  tocItems: CUPS_TO_PINTS_TOC_ITEMS,
  GuideArticle: CupsToPintsGuideArticle,
  faqs: CUPS_TO_PINTS_FAQS,
  countryRules: null,
};
