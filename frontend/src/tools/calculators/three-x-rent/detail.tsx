import type { ToolPageDetail } from '@/tools/page-detail';
import { THREE_X_RENT_FAQS, THREE_X_RENT_TOC_ITEMS } from './content';
import { ThreeXRentGuideArticle } from './ThreeXRentGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the gross income a rent multiple asks for, or the rent a gross income lines up with. The 3× figure is a screening guideline, not a legal rule.',
  asideAriaLabel: 'Interactive 3x rent calculator',
  tocItems: THREE_X_RENT_TOC_ITEMS,
  GuideArticle: ThreeXRentGuideArticle,
  faqs: THREE_X_RENT_FAQS,
  countryRules: null,
};
