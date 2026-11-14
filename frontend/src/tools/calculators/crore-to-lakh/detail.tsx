import type { ToolPageDetail } from '@/tools/page-detail';
import { CroreToLakhGuideArticle } from './CroreToLakhGuideArticle';
import { CRORE_LAKH_FAQS, CRORE_LAKH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert crores to lakhs and lakhs to crores with Indian and international number formatting.',
  asideAriaLabel: 'Interactive crore to lakh converter',
  tocItems: CRORE_LAKH_TOC_ITEMS,
  GuideArticle: CroreToLakhGuideArticle,
  faqs: CRORE_LAKH_FAQS,
  countryRules: null,
};
