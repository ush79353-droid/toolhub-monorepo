import type { ToolPageDetail } from '@/tools/page-detail';
import { ArterialBloodPhGuideArticle } from './ArterialBloodPhGuideArticle';
import {
  ARTERIAL_BLOOD_PH_FAQS,
  ARTERIAL_BLOOD_PH_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Henderson–Hasselbalch arterial pH from HCO₃ and PaCO₂ — not a lab ABG report.',
  asideAriaLabel: 'Interactive Arterial Blood pH Calculator',
  tocItems: ARTERIAL_BLOOD_PH_TOC_ITEMS,
  GuideArticle: ArterialBloodPhGuideArticle,
  faqs: ARTERIAL_BLOOD_PH_FAQS,
  countryRules: null,
};
