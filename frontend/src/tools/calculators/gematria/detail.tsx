import type { ToolPageDetail } from '@/tools/page-detail';
import { GematriaGuideArticle } from './GematriaGuideArticle';
import { GEMATRIA_FAQS, GEMATRIA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Simple, English, and Jewish/Hebrew Gematria values for words, names, and phrases.',
  asideAriaLabel: 'Interactive gematria calculator',
  tocItems: GEMATRIA_TOC_ITEMS,
  GuideArticle: GematriaGuideArticle,
  faqs: GEMATRIA_FAQS,
  countryRules: null,
};
