import type { ToolPageDetail } from '@/tools/page-detail';
import { UrineOutputGuideArticle } from './UrineOutputGuideArticle';
import { URINE_OUTPUT_FAQS, URINE_OUTPUT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Urine output rate (mL/kg/h) and optional intake-minus-urine balance — educational monitoring worksheet only.',
  asideAriaLabel: 'Interactive Urine Output Calculator',
  tocItems: URINE_OUTPUT_TOC_ITEMS,
  GuideArticle: UrineOutputGuideArticle,
  faqs: URINE_OUTPUT_FAQS,
  countryRules: null,
};