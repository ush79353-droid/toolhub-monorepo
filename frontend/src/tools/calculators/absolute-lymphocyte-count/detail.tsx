import type { ToolPageDetail } from '@/tools/page-detail';
import { AbsoluteLymphocyteCountGuideArticle } from './AbsoluteLymphocyteCountGuideArticle';
import {
  ABSOLUTE_LYMPHOCYTE_COUNT_FAQS,
  ABSOLUTE_LYMPHOCYTE_COUNT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational absolute lymphocyte count from WBC and lymphocyte % — standard CBC arithmetic, not a laboratory report.',
  asideAriaLabel: 'Interactive Absolute Lymphocyte Count Calculator',
  tocItems: ABSOLUTE_LYMPHOCYTE_COUNT_TOC_ITEMS,
  GuideArticle: AbsoluteLymphocyteCountGuideArticle,
  faqs: ABSOLUTE_LYMPHOCYTE_COUNT_FAQS,
  countryRules: null,
};