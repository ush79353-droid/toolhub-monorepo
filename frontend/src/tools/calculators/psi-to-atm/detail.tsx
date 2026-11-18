import type { ToolPageDetail } from '@/tools/page-detail';
import { PsiToAtmGuideArticle } from './PsiToAtmGuideArticle';
import { PSI_TO_ATM_FAQS, PSI_TO_ATM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert PSI to ATM and ATM to PSI instantly. Exact via 1 atm = 101,325 Pa and international psi.',
  asideAriaLabel: 'Interactive PSI to ATM converter',
  tocItems: PSI_TO_ATM_TOC_ITEMS,
  GuideArticle: PsiToAtmGuideArticle,
  faqs: PSI_TO_ATM_FAQS,
  countryRules: null,
};
