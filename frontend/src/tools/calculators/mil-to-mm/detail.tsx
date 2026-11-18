import type { ToolPageDetail } from '@/tools/page-detail';
import { MilToMmGuideArticle } from './MilToMmGuideArticle';
import { MIL_MM_FAQS, MIL_MM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mils (thousandths of an inch) to millimeters and back. Exact: 1 mil = 0.0254 mm.',
  asideAriaLabel: 'Interactive mil to millimeter conversion calculator',
  tocItems: MIL_MM_TOC_ITEMS,
  GuideArticle: MilToMmGuideArticle,
  faqs: MIL_MM_FAQS,
  countryRules: null,
};
