import type { ToolPageDetail } from '@/tools/page-detail';
import { QUARTS_TO_POUNDS_FAQS, QUARTS_TO_POUNDS_TOC_ITEMS } from './content';
import { QuartsToPoundsGuideArticle } from './QuartsToPoundsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert quarts to pounds and pounds to quarts using ingredient density. US liquid, Imperial, and US dry quart standards are clearly distinguished.',
  asideAriaLabel: 'Interactive quarts to pounds conversion calculator',
  tocItems: QUARTS_TO_POUNDS_TOC_ITEMS,
  GuideArticle: QuartsToPoundsGuideArticle,
  faqs: QUARTS_TO_POUNDS_FAQS,
  countryRules: null,
};
