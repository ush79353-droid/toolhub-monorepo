import type { ToolPageDetail } from '@/tools/page-detail';
import { IvigDoseGuideArticle } from './IvigDoseGuideArticle';
import { IVIG_DOSE_FAQS, IVIG_DOSE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational IVIG weight-based grams and RhIG fetomaternal-hemorrhage vial worksheet — not a prescription.',
  asideAriaLabel: 'Interactive IVIG Dose Calculator',
  tocItems: IVIG_DOSE_TOC_ITEMS,
  GuideArticle: IvigDoseGuideArticle,
  faqs: IVIG_DOSE_FAQS,
  countryRules: null,
};
