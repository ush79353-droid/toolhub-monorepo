import type { ToolPageDetail } from '@/tools/page-detail';
import { CentToSquareMeterGuideArticle } from './CentToSquareMeterGuideArticle';
import {
  CENT_TO_SQUARE_METER_FAQS,
  CENT_TO_SQUARE_METER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert land area in cents to square meters and square feet (and back) with exact international acre factors.',
  asideAriaLabel: 'Interactive Cent to Square Meter converter',
  tocItems: CENT_TO_SQUARE_METER_TOC_ITEMS,
  GuideArticle: CentToSquareMeterGuideArticle,
  faqs: CENT_TO_SQUARE_METER_FAQS,
  countryRules: null,
};
