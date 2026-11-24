import type { ToolPageDetail } from '@/tools/page-detail';
import { CageGuideArticle } from './CageGuideArticle';
import { CAGE_FAQS, CAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational CAGE alcohol screen (0–4) — not a diagnosis of alcoholism.',
  asideAriaLabel: 'Interactive CAGE Questionnaire Calculator',
  tocItems: CAGE_TOC_ITEMS,
  GuideArticle: CageGuideArticle,
  faqs: CAGE_FAQS,
  countryRules: null,
};
