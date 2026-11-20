import type { ToolPageDetail } from '@/tools/page-detail';
import { Rule2836GuideArticle } from './Rule2836GuideArticle';
import { RULE_2836_FAQS, RULE_2836_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare housing costs and total monthly debts to the classic 28% front-end and 36% back-end affordability guidelines using gross monthly income.',
  asideAriaLabel: 'Interactive 28/36 Rule Calculator',
  tocItems: RULE_2836_TOC_ITEMS,
  GuideArticle: Rule2836GuideArticle,
  faqs: RULE_2836_FAQS,
  countryRules: null,
};
