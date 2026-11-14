import type { ToolPageDetail } from '@/tools/page-detail';
import { GreekGematriaGuideArticle } from './GreekGematriaGuideArticle';
import { GREEK_GEMATRIA_FAQS, GREEK_GEMATRIA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate traditional Greek isopsephy values for Greek words and phrases with letter-by-letter breakdowns.',
  asideAriaLabel: 'Interactive Greek gematria calculator',
  tocItems: GREEK_GEMATRIA_TOC_ITEMS,
  GuideArticle: GreekGematriaGuideArticle,
  faqs: GREEK_GEMATRIA_FAQS,
  countryRules: null,
};
