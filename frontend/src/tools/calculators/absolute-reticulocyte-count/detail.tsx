import type { ToolPageDetail } from '@/tools/page-detail';
import { AbsoluteReticulocyteCountGuideArticle } from './AbsoluteReticulocyteCountGuideArticle';
import {
  ABSOLUTE_RETICULOCYTE_COUNT_FAQS,
  ABSOLUTE_RETICULOCYTE_COUNT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational absolute reticulocyte count from hematocrit and reticulocyte % — standard teaching arithmetic, not a laboratory report.',
  asideAriaLabel: 'Interactive Absolute Reticulocyte Count Calculator',
  tocItems: ABSOLUTE_RETICULOCYTE_COUNT_TOC_ITEMS,
  GuideArticle: AbsoluteReticulocyteCountGuideArticle,
  faqs: ABSOLUTE_RETICULOCYTE_COUNT_FAQS,
  countryRules: null,
};