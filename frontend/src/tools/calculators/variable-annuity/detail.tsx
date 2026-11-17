import type { ToolPageDetail } from '@/tools/page-detail';
import { VariableAnnuityGuideArticle } from './VariableAnnuityGuideArticle';
import { VARIABLE_ANNUITY_FAQS, VARIABLE_ANNUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a variable annuity’s final balance from age, contributions, return, and a published US federal taxable comparison — with independent FX on money fields.',
  asideAriaLabel: 'Interactive Variable Annuity Calculator',
  tocItems: VARIABLE_ANNUITY_TOC_ITEMS,
  GuideArticle: VariableAnnuityGuideArticle,
  faqs: VARIABLE_ANNUITY_FAQS,
  countryRules: null,
};
