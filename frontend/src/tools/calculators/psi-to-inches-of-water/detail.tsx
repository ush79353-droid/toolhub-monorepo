import type { ToolPageDetail } from '@/tools/page-detail';
import { PsiToInchesOfWaterGuideArticle } from './PsiToInchesOfWaterGuideArticle';
import {
  PSI_TO_INCHES_OF_WATER_FAQS,
  PSI_TO_INCHES_OF_WATER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert PSI to inches of water (inH₂O) and back instantly. Uses the 4 °C water-column convention.',
  asideAriaLabel: 'Interactive PSI to inches of water converter',
  tocItems: PSI_TO_INCHES_OF_WATER_TOC_ITEMS,
  GuideArticle: PsiToInchesOfWaterGuideArticle,
  faqs: PSI_TO_INCHES_OF_WATER_FAQS,
  countryRules: null,
};
