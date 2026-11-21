import type { ToolPageDetail } from '@/tools/page-detail';
import { DosageGuideArticle } from './DosageGuideArticle';
import { DOSAGE_FAQS, DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Dosage Calculator to convert an ordered mass-per-kilogram figure into dose mass and optional liquid volume. Educational arithmetic only—not prescribing advice.',
  asideAriaLabel: 'Interactive Dosage Calculator',
  tocItems: DOSAGE_TOC_ITEMS,
  GuideArticle: DosageGuideArticle,
  faqs: DOSAGE_FAQS,
  countryRules: null,
};
