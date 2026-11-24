import type { ToolPageDetail } from '@/tools/page-detail';
import { KetoGuideArticle } from './KetoGuideArticle';
import { KETO_FAQS, KETO_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate keto calorie allocation and fat / carbohydrate / protein intakes from sex, height, weight, age, activity, and diet pace.',
  asideAriaLabel: 'Interactive Keto Calculator',
  tocItems: KETO_TOC,
  GuideArticle: KetoGuideArticle,
  faqs: KETO_FAQS,
  countryRules: null,
};
