import type { ToolPageDetail } from '@/tools/page-detail';
import { MentzerIndexGuideArticle } from './MentzerIndexGuideArticle';
import { MENTZER_INDEX_FAQS, MENTZER_INDEX_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Mentzer index (MCV ÷ RBC) for microcytosis screening — not a laboratory report or diagnosis.',
  asideAriaLabel: 'Interactive Mentzer Index Calculator',
  tocItems: MENTZER_INDEX_TOC,
  GuideArticle: MentzerIndexGuideArticle,
  faqs: MENTZER_INDEX_FAQS,
  countryRules: null,
};
