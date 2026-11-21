import type { ToolPageDetail } from '@/tools/page-detail';
import { BreastfeedingCalorieGuideArticle } from './BreastfeedingCalorieGuideArticle';
import {
  BREASTFEEDING_CALORIE_FAQS,
  BREASTFEEDING_CALORIE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily kilocalorie needs while breastfeeding or during pregnancy using the IOM Dietary Reference Intakes Estimated Energy Requirement (EER) plus official pregnancy and lactation additions.',
  asideAriaLabel: 'Interactive Breastfeeding Calorie Calculator',
  tocItems: BREASTFEEDING_CALORIE_TOC_ITEMS,
  GuideArticle: BreastfeedingCalorieGuideArticle,
  faqs: BREASTFEEDING_CALORIE_FAQS,
  countryRules: null,
};
