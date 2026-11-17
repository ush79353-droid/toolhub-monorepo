import type { ToolPageDetail } from '@/tools/page-detail';
import { MilToInchGuideArticle } from './MilToInchGuideArticle';
import { MIL_INCH_FAQS, MIL_INCH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mils (thousandths of an inch) to inches and back. Exact: 1 mil = 0.001 in.',
  asideAriaLabel: 'Interactive mil to inch conversion calculator',
  tocItems: MIL_INCH_TOC_ITEMS,
  GuideArticle: MilToInchGuideArticle,
  faqs: MIL_INCH_FAQS,
  countryRules: null,
};
