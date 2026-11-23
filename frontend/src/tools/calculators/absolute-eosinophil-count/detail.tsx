import type { ToolPageDetail } from '@/tools/page-detail';
import { AbsoluteEosinophilCountGuideArticle } from './AbsoluteEosinophilCountGuideArticle';
import {
  ABSOLUTE_EOSINOPHIL_COUNT_FAQS,
  ABSOLUTE_EOSINOPHIL_COUNT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational absolute eosinophil count from WBC and eosinophil % — standard CBC arithmetic, not a laboratory report.',
  asideAriaLabel: 'Interactive Absolute Eosinophil Count Calculator',
  tocItems: ABSOLUTE_EOSINOPHIL_COUNT_TOC_ITEMS,
  GuideArticle: AbsoluteEosinophilCountGuideArticle,
  faqs: ABSOLUTE_EOSINOPHIL_COUNT_FAQS,
  countryRules: null,
};