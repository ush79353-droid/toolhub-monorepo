import type { ToolPageDetail } from '@/tools/page-detail';
import { BicarbonateDeficitGuideArticle } from './BicarbonateDeficitGuideArticle';
import {
  BICARBONATE_DEFICIT_FAQS,
  BICARBONATE_DEFICIT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate bicarbonate deficit amount with the classic 0.5 L/kg teaching formula — educational only.',
  asideAriaLabel: 'Interactive Bicarbonate Deficit Calculator',
  tocItems: BICARBONATE_DEFICIT_TOC_ITEMS,
  GuideArticle: BicarbonateDeficitGuideArticle,
  faqs: BICARBONATE_DEFICIT_FAQS,
  countryRules: null,
};
