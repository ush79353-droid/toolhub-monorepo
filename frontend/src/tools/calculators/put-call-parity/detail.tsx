import type { ToolPageDetail } from '@/tools/page-detail';
import { PutCallParityGuideArticle } from './PutCallParityGuideArticle';
import { PUT_CALL_PARITY_FAQS, PUT_CALL_PARITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Put-Call Parity Calculator to solve any one of four European option values — call, put, present value of strike, or spot — from C + PV(K) = P + S. Enter three values with independent currencies and read the fourth.',
  asideAriaLabel: 'Interactive Put-Call Parity Calculator',
  tocItems: PUT_CALL_PARITY_TOC_ITEMS,
  GuideArticle: PutCallParityGuideArticle,
  faqs: PUT_CALL_PARITY_FAQS,
  countryRules: null,
};
