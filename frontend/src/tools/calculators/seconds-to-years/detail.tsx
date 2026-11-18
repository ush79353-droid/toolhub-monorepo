import type { ToolPageDetail } from '@/tools/page-detail';
import { SecondsToYearsGuideArticle } from './SecondsToYearsGuideArticle';
import { S2Y_FAQS, S2Y_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert seconds to years and years to seconds using a Gregorian mean year of 365.2425 days (31,556,952 seconds).',
  asideAriaLabel: 'Interactive seconds to years conversion calculator',
  tocItems: S2Y_TOC_ITEMS,
  GuideArticle: SecondsToYearsGuideArticle,
  faqs: S2Y_FAQS,
  countryRules: null,
};
