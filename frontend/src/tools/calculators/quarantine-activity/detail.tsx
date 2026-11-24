import type { ToolPageDetail } from '@/tools/page-detail';
import { QuarantineActivityGuideArticle } from './QuarantineActivityGuideArticle';
import {
  QUARANTINE_ACTIVITY_FAQS,
  QUARANTINE_ACTIVITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate quarantine-era maintenance calories from activity level (PAL) and optional MET activity swaps.',
  asideAriaLabel: 'Interactive Quarantine Activity Calculator',
  tocItems: QUARANTINE_ACTIVITY_TOC_ITEMS,
  GuideArticle: QuarantineActivityGuideArticle,
  faqs: QUARANTINE_ACTIVITY_FAQS,
  countryRules: null,
};
