import type { ToolPageDetail } from '@/tools/page-detail';
import { AncAbsoluteNeutrophilCountGuideArticle } from './AncAbsoluteNeutrophilCountGuideArticle';
import {
  ANC_ABSOLUTE_NEUTROPHIL_COUNT_FAQS,
  ANC_ABSOLUTE_NEUTROPHIL_COUNT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational absolute neutrophil count from WBC, segs %, and bands % — standard CBC arithmetic, not a laboratory report.',
  asideAriaLabel: 'Interactive ANC Calculator — Absolute Neutrophil Count',
  tocItems: ANC_ABSOLUTE_NEUTROPHIL_COUNT_TOC_ITEMS,
  GuideArticle: AncAbsoluteNeutrophilCountGuideArticle,
  faqs: ANC_ABSOLUTE_NEUTROPHIL_COUNT_FAQS,
  countryRules: null,
};