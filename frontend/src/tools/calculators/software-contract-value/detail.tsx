import type { ToolPageDetail } from '@/tools/page-detail';
import { SoftwareContractValueGuideArticle } from './SoftwareContractValueGuideArticle';
import { SCV_FAQS, SCV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate discounted software contract cost from retail price per seat, seats, discount, and term. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive software contract value calculator',
  tocItems: SCV_TOC_ITEMS,
  GuideArticle: SoftwareContractValueGuideArticle,
  faqs: SCV_FAQS,
  countryRules: null,
};
