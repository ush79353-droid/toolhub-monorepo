import type { ToolPageDetail } from '@/tools/page-detail';
import { TpaStrokeGuideArticle } from './TpaStrokeGuideArticle';
import { TPA_STROKE_FAQS, TPA_STROKE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Activase (alteplase) acute ischemic stroke dose worksheet — not a prescription or eligibility decision.',
  asideAriaLabel: 'Interactive tPA Stroke Dosing Calculator',
  tocItems: TPA_STROKE_TOC,
  GuideArticle: TpaStrokeGuideArticle,
  faqs: TPA_STROKE_FAQS,
  countryRules: null,
};
