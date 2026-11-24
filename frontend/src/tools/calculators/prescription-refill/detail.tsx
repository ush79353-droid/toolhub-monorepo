import type { ToolPageDetail } from '@/tools/page-detail';
import { PrescriptionRefillGuideArticle } from './PrescriptionRefillGuideArticle';
import {
  PRESCRIPTION_REFILL_FAQS,
  PRESCRIPTION_REFILL_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational next-refill dates from fill date, quantity dispensed, and fixed daily use. Not dispensing authorization or medical advice.',
  asideAriaLabel: 'Interactive Prescription Refill Calculator',
  tocItems: PRESCRIPTION_REFILL_TOC_ITEMS,
  GuideArticle: PrescriptionRefillGuideArticle,
  faqs: PRESCRIPTION_REFILL_FAQS,
  countryRules: null,
};
