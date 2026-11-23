import type { ToolPageDetail } from '@/tools/page-detail';
import { SIDEBAR_COUNTRIES } from '@/tools/shared/sidebar-countries';
import { AutoLoanGuideArticle } from './AutoLoanGuideArticle';
import { AUTO_LOAN_FAQS, AUTO_LOAN_TOC_ITEMS } from './content';

/** Sample credits so the shared block can be reviewed on Auto Loan. Records replace this later. */
const AUTO_LOAN_CREDITS = {
  editorialPolicyHref: '/about',
  creators: [
    {
      name: 'Amina Rahman',
      linkedInUrl: 'https://www.linkedin.com/',
      profileHref: '/about',
      bio: 'Amina reviews the Auto Loan calculator’s inputs, payment formula, and worked example before the page is published. This sample bio is here so the credit card can be checked. A contributor record will replace it.',
    },
  ],
  reviewers: [
    {
      name: 'Daniel Okonkwo',
      linkedInUrl: 'https://www.linkedin.com/',
      profileHref: '/about',
      bio: 'Daniel checks the result against a known amortization case and reads the guide for plain language. This sample bio is here so the reviewer card can be checked. A contributor record will replace it.',
    },
  ],
} as const;

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly car payments, net trade-in equity, sales tax, fees, total interest, and payoff date directly in your browser.',
  asideAriaLabel: 'Interactive auto loan calculator',
  tocItems: AUTO_LOAN_TOC_ITEMS,
  GuideArticle: AutoLoanGuideArticle,
  faqs: AUTO_LOAN_FAQS,
  credits: AUTO_LOAN_CREDITS,
  countryRules: {
    title: 'Auto loan rules by country',
    countries: SIDEBAR_COUNTRIES,
  },
};
