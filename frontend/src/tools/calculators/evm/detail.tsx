import type { ToolPageDetail } from '@/tools/page-detail';
import { EvmGuideArticle } from './EvmGuideArticle';
import { EVM_FAQS, EVM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute Planned Value, Earned Value, Actual Cost, variances, and CPI/SPI from scheduled progress, actual progress, budget, and costs. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive EVM calculator',
  tocItems: EVM_TOC_ITEMS,
  GuideArticle: EvmGuideArticle,
  faqs: EVM_FAQS,
  countryRules: null,
};
