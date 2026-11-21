import type { ToolPageDetail } from '@/tools/page-detail';
import { CcfToThermsGuideArticle } from './CcfToThermsGuideArticle';
import { CCF_TO_THERMS_FAQS, CCF_TO_THERMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert CCF to therms with an adjustable heating value. Default factor 1.038 is illustrative. Use your utility bill when available.',
  asideAriaLabel: 'Interactive CCF to therms calculator',
  tocItems: CCF_TO_THERMS_TOC_ITEMS,
  GuideArticle: CcfToThermsGuideArticle,
  faqs: CCF_TO_THERMS_FAQS,
  countryRules: null,
};
