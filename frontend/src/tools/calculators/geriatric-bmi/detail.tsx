import type { ToolPageDetail } from '@/tools/page-detail';
import { GeriatricBmiGuideArticle } from './GeriatricBmiGuideArticle';
import { GERIATRIC_BMI_FAQS, GERIATRIC_BMI_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate BMI and interpret it with older-adult cut-points (<23, 23–29.9, ≥30).',
  asideAriaLabel: 'Interactive Geriatric BMI Calculator',
  tocItems: GERIATRIC_BMI_TOC,
  GuideArticle: GeriatricBmiGuideArticle,
  faqs: GERIATRIC_BMI_FAQS,
  countryRules: null,
};
