import type { ToolPageDetail } from '@/tools/page-detail';
import { DayConverterGuideArticle } from './DayConverterGuideArticle';
import { DAY_CONVERTER_FAQS, DAY_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert days into years, months, weeks, hours, minutes, and seconds — with a combined duration clock. Years and months use average Gregorian lengths.',
  asideAriaLabel: 'Interactive day converter',
  tocItems: DAY_CONVERTER_TOC_ITEMS,
  GuideArticle: DayConverterGuideArticle,
  faqs: DAY_CONVERTER_FAQS,
  countryRules: null,
};
