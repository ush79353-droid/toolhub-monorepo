import type { ToolPageDetail } from '@/tools/page-detail';
import { BenadrylDosageGuideArticle } from './BenadrylDosageGuideArticle';
import { BENADRYL_DOSAGE_FAQS, BENADRYL_DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Look up US OTC Benadryl® (diphenhydramine) oral label dose bands by age and product. Educational reference — not medical advice.',
  asideAriaLabel: 'Interactive Benadryl Dosage Calculator',
  tocItems: BENADRYL_DOSAGE_TOC_ITEMS,
  GuideArticle: BenadrylDosageGuideArticle,
  faqs: BENADRYL_DOSAGE_FAQS,
  countryRules: null,
};
