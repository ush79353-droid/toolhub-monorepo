import type { ToolPageDetail } from '@/tools/page-detail';
import { EcgBoxesToSecondsGuideArticle } from './EcgBoxesToSecondsGuideArticle';
import { ECG_BOXES_FAQS, ECG_BOXES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert counted ECG grid boxes into time at 25 or 50 mm/s. Educational strip-timing aid — not a diagnosis.',
  asideAriaLabel: 'Interactive ECG Boxes to Seconds Calculator',
  tocItems: ECG_BOXES_TOC_ITEMS,
  GuideArticle: EcgBoxesToSecondsGuideArticle,
  faqs: ECG_BOXES_FAQS,
  countryRules: null,
};
