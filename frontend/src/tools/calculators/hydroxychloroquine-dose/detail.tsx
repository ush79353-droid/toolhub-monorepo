import type { ToolPageDetail } from '@/tools/page-detail';
import { HydroxychloroquineDoseGuideArticle } from './HydroxychloroquineDoseGuideArticle';
import {
  HYDROXYCHLOROQUINE_FAQS,
  HYDROXYCHLOROQUINE_TOC,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FDA/DailyMed checker for a supplied hydroxychloroquine sulfate daily regimen versus the ≥5 mg/kg/day actual-body-weight retinopathy threshold — not a prescription.',
  asideAriaLabel: 'Interactive Hydroxychloroquine Dose Calculator',
  tocItems: HYDROXYCHLOROQUINE_TOC,
  GuideArticle: HydroxychloroquineDoseGuideArticle,
  faqs: HYDROXYCHLOROQUINE_FAQS,
  countryRules: null,
};
