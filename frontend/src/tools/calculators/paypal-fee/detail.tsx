import type { ToolPageDetail } from '@/tools/page-detail';
import { PayPalFeeGuideArticle } from './PayPalFeeGuideArticle';
import { PAYPAL_FEE_FAQS, PAYPAL_FEE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate PayPal transaction fees, net amounts received, and the gross you need to charge, using verified US/UK schedules or custom rates.',
  asideAriaLabel: 'Interactive PayPal Fee Calculator',
  tocItems: PAYPAL_FEE_TOC_ITEMS,
  GuideArticle: PayPalFeeGuideArticle,
  faqs: PAYPAL_FEE_FAQS,
  countryRules: null,
};
