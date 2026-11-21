import type { ToolPageDetail } from '@/tools/page-detail';
import { CapitalGainsTaxUkGuideArticle } from './CapitalGainsTaxUkGuideArticle';
import {
  CAPITAL_GAINS_TAX_UK_FAQS,
  CAPITAL_GAINS_TAX_UK_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate UK Capital Gains Tax from gains, asset type, trust status, and taxable income using HMRC rates for 2025/26 and 2026/27. Fixed GBP.',
  asideAriaLabel: 'Interactive Capital Gains Tax UK Calculator',
  tocItems: CAPITAL_GAINS_TAX_UK_TOC_ITEMS,
  GuideArticle: CapitalGainsTaxUkGuideArticle,
  faqs: CAPITAL_GAINS_TAX_UK_FAQS,
  countryRules: null,
};
