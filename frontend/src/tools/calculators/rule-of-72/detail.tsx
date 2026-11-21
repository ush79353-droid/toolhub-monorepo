import type { ToolPageDetail } from '@/tools/page-detail';
import { RuleOf72GuideArticle } from './RuleOf72GuideArticle';
import { RULE_OF_72_FAQS, RULE_OF_72_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long it takes to double at a given percent increase per period—or the rate needed to double in a target number of periods—using the Rule of 72 approximation.',
  asideAriaLabel: 'Interactive Rule of 72 Calculator',
  tocItems: RULE_OF_72_TOC_ITEMS,
  GuideArticle: RuleOf72GuideArticle,
  faqs: RULE_OF_72_FAQS,
  countryRules: null,
};
