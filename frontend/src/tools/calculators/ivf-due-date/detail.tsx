import type { ToolPageDetail } from '@/tools/page-detail';
import { IvfDueDateGuideArticle } from './IvfDueDateGuideArticle';
import { IVF_DUE_DATE_FAQS, IVF_DUE_DATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our IVF Due Date Calculator for ACOG-style educational dating from Day-3/Day-5 embryo transfer or retrieval/fertilization. Twins or triplets do not change the calendar due date.',
  asideAriaLabel: 'Interactive IVF Due Date Calculator',
  tocItems: IVF_DUE_DATE_TOC_ITEMS,
  GuideArticle: IvfDueDateGuideArticle,
  faqs: IVF_DUE_DATE_FAQS,
  countryRules: null,
};
