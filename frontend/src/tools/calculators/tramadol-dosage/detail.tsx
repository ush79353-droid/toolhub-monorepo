import type { ToolPageDetail } from '@/tools/page-detail';
import { TramadolDosageGuideArticle } from './TramadolDosageGuideArticle';
import { TRAMADOL_DOSAGE_FAQS, TRAMADOL_DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Tramadol Dosage Calculator to convert a clinician-prescribed daily milligram amount into whole extended-release tablets. No public titration. Always follow the label and your clinician.',
  asideAriaLabel: 'Interactive Tramadol Dosage Calculator',
  tocItems: TRAMADOL_DOSAGE_TOC_ITEMS,
  GuideArticle: TramadolDosageGuideArticle,
  faqs: TRAMADOL_DOSAGE_FAQS,
  countryRules: null,
};
