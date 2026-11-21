import type { ToolPageDetail } from '@/tools/page-detail';
import { ImmediateAnnuityGuideArticle } from './ImmediateAnnuityGuideArticle';
import { IMMEDIATE_ANNUITY_FAQS, IMMEDIATE_ANNUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve immediate annuity withdrawals, required investment, duration, return, or remaining balance, with yearly schedule and real FX.',
  asideAriaLabel: 'Interactive Immediate Annuity Calculator',
  tocItems: IMMEDIATE_ANNUITY_TOC_ITEMS,
  GuideArticle: ImmediateAnnuityGuideArticle,
  faqs: IMMEDIATE_ANNUITY_FAQS,
  countryRules: null,
};
