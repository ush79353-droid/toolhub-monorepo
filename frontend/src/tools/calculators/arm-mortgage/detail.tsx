import type { ToolPageDetail } from '@/tools/page-detail';
import { SIDEBAR_COUNTRIES } from '@/tools/shared/sidebar-countries';
import { ArmMortgageGuideArticle } from './ArmMortgageGuideArticle';
import { ARM_FAQS, ARM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate an adjustable-rate mortgage payment through the fixed period and modeled resets, including caps, remaining-term re-amortization, and optional housing costs.',
  asideAriaLabel: 'Interactive ARM mortgage calculator',
  tocItems: ARM_TOC_ITEMS,
  GuideArticle: ArmMortgageGuideArticle,
  faqs: ARM_FAQS,
  countryRules: {
    title: 'Mortgage rules by country',
    countries: SIDEBAR_COUNTRIES,
  },
};
