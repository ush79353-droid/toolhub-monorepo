import type { ToolPageDetail } from '@/tools/page-detail';
import { PINT_TO_POUND_FAQS, PINT_TO_POUND_TOC_ITEMS } from './content';
import { PintToPoundGuideArticle } from './PintToPoundGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pints to pounds and pounds to pints using ingredient density. US liquid, imperial, and US dry pint standards are clearly distinguished.',
  asideAriaLabel: 'Interactive pint to pound conversion calculator',
  tocItems: PINT_TO_POUND_TOC_ITEMS,
  GuideArticle: PintToPoundGuideArticle,
  faqs: PINT_TO_POUND_FAQS,
  countryRules: null,
};
