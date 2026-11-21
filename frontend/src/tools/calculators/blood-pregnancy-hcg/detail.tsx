import type { ToolPageDetail } from '@/tools/page-detail';
import { BloodPregnancyHcgGuideArticle } from './BloodPregnancyHcgGuideArticle';
import {
  BLOOD_PREGNANCY_HCG_FAQS,
  BLOOD_PREGNANCY_HCG_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate when to take urine or blood pregnancy tests after natural conception or IVF, with educational hCG context — not lab interpretation.',
  asideAriaLabel: 'Interactive pregnancy test timing calculator',
  tocItems: BLOOD_PREGNANCY_HCG_TOC_ITEMS,
  GuideArticle: BloodPregnancyHcgGuideArticle,
  faqs: BLOOD_PREGNANCY_HCG_FAQS,
  countryRules: null,
};
