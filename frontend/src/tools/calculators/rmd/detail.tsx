import type { ToolPageDetail } from '@/tools/page-detail';
import { RmdGuideArticle } from './RmdGuideArticle';
import { RMD_FAQS, RMD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate an owner lifetime RMD with the IRS Uniform Lifetime Table (2022+). SECURE 2.0 starting ages are generally 73 or 75 by birth cohort; joint-life Table II is unsupported without spouse age. Independent FX on balance and RMD.',
  asideAriaLabel: 'Interactive RMD Calculator',
  tocItems: RMD_TOC_ITEMS,
  GuideArticle: RmdGuideArticle,
  faqs: RMD_FAQS,
  countryRules: null,
};
