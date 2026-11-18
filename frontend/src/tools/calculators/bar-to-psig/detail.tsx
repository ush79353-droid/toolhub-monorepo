import type { ToolPageDetail } from '@/tools/page-detail';
import { BarToPsigGuideArticle } from './BarToPsigGuideArticle';
import { BAR_TO_PSIG_FAQS, BAR_TO_PSIG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert absolute or gauge bar to PSIG with editable atmospheric pressure (default 1.01325 bar).',
  asideAriaLabel: 'Interactive bar to PSIG converter',
  tocItems: BAR_TO_PSIG_TOC_ITEMS,
  GuideArticle: BarToPsigGuideArticle,
  faqs: BAR_TO_PSIG_FAQS,
  countryRules: null,
};
