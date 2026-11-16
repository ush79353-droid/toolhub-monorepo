import type { ToolPageDetail } from '@/tools/page-detail';
import { AngstromToNmGuideArticle } from './AngstromToNmGuideArticle';
import { ANGSTROM_TO_NM_FAQS, ANGSTROM_TO_NM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert angstroms to nanometers (and mils) instantly using exact factors 1 Å = 0.1 nm and 1 mil = 25,400 nm.',
  asideAriaLabel: 'Interactive angstrom to nanometer converter',
  tocItems: ANGSTROM_TO_NM_TOC_ITEMS,
  GuideArticle: AngstromToNmGuideArticle,
  faqs: ANGSTROM_TO_NM_FAQS,
  countryRules: null,
};
