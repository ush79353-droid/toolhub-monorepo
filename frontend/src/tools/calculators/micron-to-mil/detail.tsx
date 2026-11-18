import type { ToolPageDetail } from '@/tools/page-detail';
import { MicronToMilGuideArticle } from './MicronToMilGuideArticle';
import { MICRON_TO_MIL_FAQS, MICRON_TO_MIL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert microns (µm) to mils and mils to microns instantly. Exact: 1 mil = 25.4 µm (a mil is 0.001 inch, not a millimeter).',
  asideAriaLabel: 'Interactive micron to mil conversion calculator',
  tocItems: MICRON_TO_MIL_TOC_ITEMS,
  GuideArticle: MicronToMilGuideArticle,
  faqs: MICRON_TO_MIL_FAQS,
  countryRules: null,
};
