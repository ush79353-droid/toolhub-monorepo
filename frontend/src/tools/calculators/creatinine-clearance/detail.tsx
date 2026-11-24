import type { ToolPageDetail } from '@/tools/page-detail';
import { CreatinineClearanceGuideArticle } from './CreatinineClearanceGuideArticle';
import {
  CREATININE_CLEARANCE_FAQS,
  CREATININE_CLEARANCE_TOC,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate creatinine clearance with Cockcroft–Gault (BMI-based weight) or measure it from a timed urine collection — educational only.',
  asideAriaLabel: 'Interactive Creatinine Clearance Calculator',
  tocItems: CREATININE_CLEARANCE_TOC,
  GuideArticle: CreatinineClearanceGuideArticle,
  faqs: CREATININE_CLEARANCE_FAQS,
  countryRules: null,
};
