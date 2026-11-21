import type { ToolPageDetail } from '@/tools/page-detail';
import { LeetSpeakGuideArticle } from './LeetSpeakGuideArticle';
import { LEET_SPEAK_FAQS, LEET_SPEAK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Translate normal text into leet-speak (1337) and decode common leet digits. Classic and Basic maps; reverse results are approximate.',
  asideAriaLabel: 'Interactive leet-speak translator',
  tocItems: LEET_SPEAK_TOC_ITEMS,
  GuideArticle: LeetSpeakGuideArticle,
  faqs: LEET_SPEAK_FAQS,
  countryRules: null,
};
