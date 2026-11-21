import type { ToolPageDetail } from '@/tools/page-detail';
import { GabapentinDosageGuideArticle } from './GabapentinDosageGuideArticle';
import {
  GABAPENTIN_DOSAGE_FAQS,
  GABAPENTIN_DOSAGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'FDA NEURONTIN (gabapentin) label explorer by indication and age — approved schedules only; off-label paths stay informational.',
  asideAriaLabel: 'Interactive Gabapentin Dosage Calculator',
  tocItems: GABAPENTIN_DOSAGE_TOC_ITEMS,
  GuideArticle: GabapentinDosageGuideArticle,
  faqs: GABAPENTIN_DOSAGE_FAQS,
  countryRules: null,
};
