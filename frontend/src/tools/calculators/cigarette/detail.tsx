import type { ToolPageDetail } from '@/tools/page-detail';
import { CigaretteGuideArticle } from './CigaretteGuideArticle';
import { CIGARETTE_FAQS, CIGARETTE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate total cigarettes smoked from daily rate, pack size, and time frame — educational exposure count only.',
  asideAriaLabel: 'Interactive Cigarette Calculator',
  tocItems: CIGARETTE_TOC_ITEMS,
  GuideArticle: CigaretteGuideArticle,
  faqs: CIGARETTE_FAQS,
  countryRules: null,
};
