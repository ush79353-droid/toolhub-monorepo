import type { ToolPageDetail } from '@/tools/page-detail';
import { AgeAdjustedDDimerGuideArticle } from './AgeAdjustedDDimerGuideArticle';
import {
  AGE_ADJUSTED_D_DIMER_FAQS,
  AGE_ADJUSTED_D_DIMER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Age-adjusted D-dimer cutoff in µg/L and µg/mL for validated FEU or DDU reporting — educational only.',
  asideAriaLabel: 'Interactive Age-Adjusted D-dimer Calculator',
  tocItems: AGE_ADJUSTED_D_DIMER_TOC_ITEMS,
  GuideArticle: AgeAdjustedDDimerGuideArticle,
  faqs: AGE_ADJUSTED_D_DIMER_FAQS,
  countryRules: null,
};