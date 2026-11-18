import type { ToolPageDetail } from '@/tools/page-detail';
import { GramToLiterGuideArticle } from './GramToLiterGuideArticle';
import { GRAM_TO_LITER_FAQS, GRAM_TO_LITER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams to liters using substance density. Calculate g to L or liters to grams for water, milk, oil, honey, and custom densities.',
  asideAriaLabel: 'Interactive gram to liter conversion calculator',
  tocItems: GRAM_TO_LITER_TOC_ITEMS,
  GuideArticle: GramToLiterGuideArticle,
  faqs: GRAM_TO_LITER_FAQS,
  countryRules: null,
};
