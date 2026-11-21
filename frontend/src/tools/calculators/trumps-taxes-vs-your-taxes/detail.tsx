import type { ToolPageDetail } from '@/tools/page-detail';
import { TRUMP_TAXES_FAQS, TRUMP_TAXES_TOC_ITEMS } from './content';
import { TrumpsTaxesGuideArticle } from './TrumpsTaxesGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare an example federal income tax amount with Trump’s reported historical $750 figure (2016/2017), see the ratio and difference, and explore illustrative spending comparisons with editable unit-price assumptions.',
  asideAriaLabel: "Trump's Taxes vs. Your Taxes Calculator guide",
  tocItems: TRUMP_TAXES_TOC_ITEMS,
  GuideArticle: TrumpsTaxesGuideArticle,
  faqs: TRUMP_TAXES_FAQS,
  countryRules: null,
};
