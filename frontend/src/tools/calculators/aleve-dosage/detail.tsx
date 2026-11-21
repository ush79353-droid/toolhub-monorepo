import type { ToolPageDetail } from '@/tools/page-detail';
import { AleveDosageGuideArticle } from './AleveDosageGuideArticle';
import { ALEVE_DOSAGE_FAQS, ALEVE_DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FDA-label lookup for OTC Aleve (naproxen sodium 220 mg) and common prescription naproxen schedules. Not medical advice.',
  asideAriaLabel: 'Interactive Aleve Dosage Calculator',
  tocItems: ALEVE_DOSAGE_TOC_ITEMS,
  GuideArticle: AleveDosageGuideArticle,
  faqs: ALEVE_DOSAGE_FAQS,
  countryRules: null,
};
