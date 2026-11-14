import type { ToolPageDetail } from '@/tools/page-detail';
import { CroreToMillionGuideArticle } from './CroreToMillionGuideArticle';
import { CRORE_MILLION_FAQS, CRORE_MILLION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert crores to millions and millions to crores with Indian and international number formatting.',
  asideAriaLabel: 'Interactive crore to million converter',
  tocItems: CRORE_MILLION_TOC_ITEMS,
  GuideArticle: CroreToMillionGuideArticle,
  faqs: CRORE_MILLION_FAQS,
  countryRules: null,
};
