import type { ToolPageDetail } from '@/tools/page-detail';
import { ClomidOvulationGuideArticle } from './ClomidOvulationGuideArticle';
import { CLOMID_OVULATION_FAQS, CLOMID_OVULATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational approximate ovulation window after a prescribed clomiphene course (5–10 days after the last treatment day). Does not confirm ovulation.',
  asideAriaLabel: 'Interactive Clomid Ovulation Calculator',
  tocItems: CLOMID_OVULATION_TOC_ITEMS,
  GuideArticle: ClomidOvulationGuideArticle,
  faqs: CLOMID_OVULATION_FAQS,
  countryRules: null,
};
