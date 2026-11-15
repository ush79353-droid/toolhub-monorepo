import type { ToolPageDetail } from '@/tools/page-detail';
import { TorrToAtmGuideArticle } from './TorrToAtmGuideArticle';
import { TORR_TO_ATM_FAQS, TORR_TO_ATM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Torr to atmospheres (atm) and atmospheres to Torr instantly with the exact 760 ratio.',
  asideAriaLabel: 'Interactive Torr to atm conversion calculator',
  tocItems: TORR_TO_ATM_TOC_ITEMS,
  GuideArticle: TorrToAtmGuideArticle,
  faqs: TORR_TO_ATM_FAQS,
  countryRules: null,
};
