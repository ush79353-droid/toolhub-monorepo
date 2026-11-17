import type { ToolPageDetail } from '@/tools/page-detail';
import { MilConversionGuideArticle } from './MilConversionGuideArticle';
import { MIL_FAQS, MIL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mils (thousandths of an inch) to microns, millimeters, inches, feet, and more. Exact: 1 mil = 0.001 in = 25.4 µm.',
  asideAriaLabel: 'Interactive mil conversion calculator',
  tocItems: MIL_TOC_ITEMS,
  GuideArticle: MilConversionGuideArticle,
  faqs: MIL_FAQS,
  countryRules: null,
};
