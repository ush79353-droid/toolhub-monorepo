import type { ToolPageDetail } from '@/tools/page-detail';
import { FraminghamRiskGuideArticle } from './FraminghamRiskGuideArticle';
import {
  FRAMINGHAM_RISK_FAQS,
  FRAMINGHAM_RISK_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ATP III Framingham hard CHD point score (pts). Sums age, lipids, blood pressure treatment, systolic BP, and smoking — not a treatment recommendation.',
  asideAriaLabel: 'Interactive Framingham Risk Calculator',
  tocItems: FRAMINGHAM_RISK_TOC_ITEMS,
  GuideArticle: FraminghamRiskGuideArticle,
  faqs: FRAMINGHAM_RISK_FAQS,
  countryRules: null,
};