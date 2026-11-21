import type { ToolPageDetail } from '@/tools/page-detail';
import { TaxBracketGuideArticle } from './TaxBracketGuideArticle';
import { TAX_BRACKET_FAQS, TAX_BRACKET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate US federal ordinary income tax from verified IRS progressive brackets by tax year and filing status; fixed USD; educational estimate only.',
  asideAriaLabel: 'Interactive Tax Bracket Calculator',
  tocItems: TAX_BRACKET_TOC_ITEMS,
  GuideArticle: TaxBracketGuideArticle,
  faqs: TAX_BRACKET_FAQS,
  countryRules: null,
};
