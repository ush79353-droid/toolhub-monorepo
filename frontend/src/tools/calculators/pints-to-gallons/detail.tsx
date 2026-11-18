import type { ToolPageDetail } from '@/tools/page-detail';
import { PintsToGallonsGuideArticle } from './PintsToGallonsGuideArticle';
import { PINTS_TO_GALLONS_FAQS, PINTS_TO_GALLONS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US and UK pints to gallons — and back. Exact: 1 gallon = 8 pints within the same system.',
  asideAriaLabel: 'Interactive pints to gallons converter',
  tocItems: PINTS_TO_GALLONS_TOC_ITEMS,
  GuideArticle: PintsToGallonsGuideArticle,
  faqs: PINTS_TO_GALLONS_FAQS,
  countryRules: null,
};
