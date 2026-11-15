import type { ToolPageDetail } from '@/tools/page-detail';
import { CCF_TO_GALLONS_FAQS, CCF_TO_GALLONS_TOC_ITEMS } from './content';
import { CcfToGallonsGuideArticle } from './CcfToGallonsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert CCF (hundred cubic feet) to US liquid gallons and gallons to CCF using the exact ratio 172800 ÷ 231.',
  asideAriaLabel: 'Interactive CCF to gallons converter',
  tocItems: CCF_TO_GALLONS_TOC_ITEMS,
  GuideArticle: CcfToGallonsGuideArticle,
  faqs: CCF_TO_GALLONS_FAQS,
  countryRules: null,
};
