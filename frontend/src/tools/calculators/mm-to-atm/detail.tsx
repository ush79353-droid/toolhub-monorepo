import type { ToolPageDetail } from '@/tools/page-detail';
import { MmToAtmGuideArticle } from './MmToAtmGuideArticle';
import { MM_TO_ATM_FAQS, MM_TO_ATM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mmHg to atm with the conventional 760 mmHg ≈ 1 atm relationship. “mm” here means mmHg pressure, not length.',
  asideAriaLabel: 'Interactive mmHg to atm converter',
  tocItems: MM_TO_ATM_TOC_ITEMS,
  GuideArticle: MmToAtmGuideArticle,
  faqs: MM_TO_ATM_FAQS,
  countryRules: null,
};
