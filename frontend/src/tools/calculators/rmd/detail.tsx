import type { ToolPageDetail } from '@/tools/page-detail';
import { RmdGuideArticle } from './RmdGuideArticle';
import { RMD_FAQS, RMD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate an IRA/plan owner lifetime required minimum distribution using the IRS Uniform Lifetime Table (2022+) and your prior year-end balance, with independent FX on balance and RMD.',
  asideAriaLabel: 'Interactive RMD Calculator',
  tocItems: RMD_TOC_ITEMS,
  GuideArticle: RmdGuideArticle,
  faqs: RMD_FAQS,
  countryRules: null,
};
