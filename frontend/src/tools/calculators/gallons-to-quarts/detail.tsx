import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToQuartsGuideArticle } from './GalToQuartsGuideArticle';
import { GAL_TO_QUARTS_FAQS, GAL_TO_QUARTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US and UK gallons to quarts instantly; bidirectional volume conversion with exact liter factors.',
  asideAriaLabel: 'Interactive gallons to quarts converter',
  tocItems: GAL_TO_QUARTS_TOC_ITEMS,
  GuideArticle: GalToQuartsGuideArticle,
  faqs: GAL_TO_QUARTS_FAQS,
  countryRules: null,
};
