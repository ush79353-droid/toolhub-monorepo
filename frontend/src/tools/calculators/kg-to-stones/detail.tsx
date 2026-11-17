import type { ToolPageDetail } from '@/tools/page-detail';
import { KgToStonesGuideArticle } from './KgToStonesGuideArticle';
import { KG_TO_STONES_FAQS, KG_TO_STONES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilograms to stones and stones to kilograms instantly. Exact: 1 st = 6.35029318 kg.',
  asideAriaLabel: 'Interactive kg to stones converter',
  tocItems: KG_TO_STONES_TOC_ITEMS,
  GuideArticle: KgToStonesGuideArticle,
  faqs: KG_TO_STONES_FAQS,
  countryRules: null,
};
