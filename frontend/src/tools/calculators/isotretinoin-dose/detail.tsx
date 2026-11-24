import type { ToolPageDetail } from '@/tools/page-detail';
import { IsotretinoinDoseGuideArticle } from './IsotretinoinDoseGuideArticle';
import { ISOTRETINOIN_FAQS, ISOTRETINOIN_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational cumulative mg/kg worksheet for isotretinoin planning math — not a prescription.',
  asideAriaLabel: 'Interactive Isotretinoin Dose Calculator',
  tocItems: ISOTRETINOIN_TOC,
  GuideArticle: IsotretinoinDoseGuideArticle,
  faqs: ISOTRETINOIN_FAQS,
  countryRules: null,
};
