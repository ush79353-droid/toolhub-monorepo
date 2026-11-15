import type { ToolPageDetail } from '@/tools/page-detail';
import { AcreageGuideArticle } from './AcreageGuideArticle';
import { ACREAGE_FAQS, ACREAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find rectangular land area from width and length, convert acres to square feet, hectares, and square meters, and estimate land cost from a unit price.',
  asideAriaLabel: 'Interactive acreage calculator',
  tocItems: ACREAGE_TOC_ITEMS,
  GuideArticle: AcreageGuideArticle,
  faqs: ACREAGE_FAQS,
  countryRules: null,
};
