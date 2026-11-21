import type { ToolPageDetail } from '@/tools/page-detail';
import { IbuprofenDosageGuideArticle } from './IbuprofenDosageGuideArticle';
import {
  IBUPROFEN_DOSAGE_FAQS,
  IBUPROFEN_DOSAGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Look up US OTC Infants’ and Children’s MOTRIN® (ibuprofen) oral suspension doses by weight. Educational label reference — not medical advice.',
  asideAriaLabel: 'Interactive Ibuprofen Dosage Calculator',
  tocItems: IBUPROFEN_DOSAGE_TOC_ITEMS,
  GuideArticle: IbuprofenDosageGuideArticle,
  faqs: IBUPROFEN_DOSAGE_FAQS,
  countryRules: null,
};
