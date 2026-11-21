import type { ToolPageDetail } from '@/tools/page-detail';
import { AmoxicillinPediatricDosageGuideArticle } from './AmoxicillinPediatricDosageGuideArticle';
import {
  AMOXICILLIN_PEDIATRIC_FAQS,
  AMOXICILLIN_PEDIATRIC_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pediatric amoxicillin mg/kg/dose into mg (and oral mL) with labeled general, strep A, and endocarditis-prophylaxis references—educational only.',
  asideAriaLabel: 'Interactive Amoxicillin Pediatric Dosage Calculator',
  tocItems: AMOXICILLIN_PEDIATRIC_TOC_ITEMS,
  GuideArticle: AmoxicillinPediatricDosageGuideArticle,
  faqs: AMOXICILLIN_PEDIATRIC_FAQS,
  countryRules: null,
};
