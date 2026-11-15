import type { ToolPageDetail } from '@/tools/page-detail';
import { SIDEBAR_COUNTRIES } from '@/tools/shared/sidebar-countries';
import { AMORTIZATION_FAQS, AMORTIZATION_TOC_ITEMS } from './content';
import { AmortizationGuideArticle } from './AmortizationGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate loan payments, complete amortization schedules, interest breakdowns, and extra payment savings with interactive charts for mortgages, auto loans, and personal financing.',
  asideAriaLabel: 'Interactive amortization calculator',
  tocItems: AMORTIZATION_TOC_ITEMS,
  GuideArticle: AmortizationGuideArticle,
  faqs: AMORTIZATION_FAQS,
  countryRules: {
    title: 'Amortization & lending rules by country',
    countries: SIDEBAR_COUNTRIES,
  },
};

