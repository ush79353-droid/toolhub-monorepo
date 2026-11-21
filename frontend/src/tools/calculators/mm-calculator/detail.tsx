import type { ToolPageDetail } from '@/tools/page-detail';
import { MmCalculatorGuideArticle } from './MmCalculatorGuideArticle';
import { MM_FAQS, MM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millimeters to cm, m, km, inches, feet, yards, and miles; 1 in = 25.4 mm exactly.',
  asideAriaLabel: 'Interactive millimeter calculator',
  tocItems: MM_TOC_ITEMS,
  GuideArticle: MmCalculatorGuideArticle,
  faqs: MM_FAQS,
  countryRules: null,
};
