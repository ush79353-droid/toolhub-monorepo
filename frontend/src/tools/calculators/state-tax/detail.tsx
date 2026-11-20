import type { ToolPageDetail } from '@/tools/page-detail';
import { StateTaxGuideArticle } from './StateTaxGuideArticle';
import { STATE_TAX_FAQS, STATE_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Choose your US state to open a dedicated state tax calculator when one is available on Omega Calculators.',
  asideAriaLabel: 'Interactive State Tax Calculator navigator',
  tocItems: STATE_TAX_TOC_ITEMS,
  GuideArticle: StateTaxGuideArticle,
  faqs: STATE_TAX_FAQS,
  countryRules: null,
};
