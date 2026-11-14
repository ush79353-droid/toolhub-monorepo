import type { ToolPageDetail } from '@/tools/page-detail';
import { CapacitanceGuideArticle } from './CapacitanceGuideArticle';
import { CAP_FAQS, CAP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert capacitance between farads, millifarads, microfarads, nanofarads, and picofarads with exact SI factors.',
  asideAriaLabel: 'Interactive capacitance converter',
  tocItems: CAP_TOC_ITEMS,
  GuideArticle: CapacitanceGuideArticle,
  faqs: CAP_FAQS,
  countryRules: null,
};
