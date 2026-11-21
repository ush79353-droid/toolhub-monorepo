import type { ToolPageDetail } from '@/tools/page-detail';
import { AnorexicBmiGuideArticle } from './AnorexicBmiGuideArticle';
import { ANOREXIC_BMI_FAQS, ANOREXIC_BMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate body mass index from height and weight with US, metric, or other units. Shows the WHO adult healthy BMI interval when age-appropriate — not a diagnosis of anorexia or any eating disorder.',
  asideAriaLabel: 'Interactive Anorexic BMI Calculator',
  tocItems: ANOREXIC_BMI_TOC_ITEMS,
  GuideArticle: AnorexicBmiGuideArticle,
  faqs: ANOREXIC_BMI_FAQS,
  countryRules: null,
};
