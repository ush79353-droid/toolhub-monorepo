import type { ToolPageDetail } from '@/tools/page-detail';
import { VenousBloodPhGuideArticle } from './VenousBloodPhGuideArticle';
import {
  VENOUS_BLOOD_PH_FAQS,
  VENOUS_BLOOD_PH_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Henderson–Hasselbalch estimated pH from HCO₃ and PaCO₂ — not a measured venous lab report.',
  asideAriaLabel: 'Interactive Venous Blood pH Calculator',
  tocItems: VENOUS_BLOOD_PH_TOC_ITEMS,
  GuideArticle: VenousBloodPhGuideArticle,
  faqs: VENOUS_BLOOD_PH_FAQS,
  countryRules: null,
};
