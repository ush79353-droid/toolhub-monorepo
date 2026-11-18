import type { ToolPageDetail } from '@/tools/page-detail';
import { MmhgToAtmGuideArticle } from './MmhgToAtmGuideArticle';
import { MMHG_ATM_FAQS, MMHG_ATM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mmHg to atm with the conventional 760 mmHg = 1 atm relationship. Bidirectional pressure conversion.',
  asideAriaLabel: 'Interactive mmHg to atm converter',
  tocItems: MMHG_ATM_TOC_ITEMS,
  GuideArticle: MmhgToAtmGuideArticle,
  faqs: MMHG_ATM_FAQS,
  countryRules: null,
};
