import type { ToolPageDetail } from '@/tools/page-detail';
import { ReverseDueDateGuideArticle } from './ReverseDueDateGuideArticle';
import {
  REVERSE_DUE_DATE_FAQS,
  REVERSE_DUE_DATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate conception timing and an approximate fertile-window start from a due date using educational ACOG-style calendar dating.',
  asideAriaLabel: 'Interactive Reverse Due Date Calculator',
  tocItems: REVERSE_DUE_DATE_TOC_ITEMS,
  GuideArticle: ReverseDueDateGuideArticle,
  faqs: REVERSE_DUE_DATE_FAQS,
  countryRules: null,
};
