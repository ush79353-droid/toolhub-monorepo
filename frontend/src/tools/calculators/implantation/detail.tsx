import type { ToolPageDetail } from '@/tools/page-detail';
import { ImplantationGuideArticle } from './ImplantationGuideArticle';
import { IMPLANTATION_FAQS, IMPLANTATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational implantation timing after ovulation or IVF transfer — calendar windows only, not ultrasound confirmation.',
  asideAriaLabel: 'Interactive Implantation Calculator',
  tocItems: IMPLANTATION_TOC_ITEMS,
  GuideArticle: ImplantationGuideArticle,
  faqs: IMPLANTATION_FAQS,
  countryRules: null,
};