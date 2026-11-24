import type { ToolPageDetail } from '@/tools/page-detail';
import { StrokeVolumeGuideArticle } from './StrokeVolumeGuideArticle';
import { STROKE_VOLUME_FAQS, STROKE_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational stroke volume from cardiac output and heart rate, with Mosteller BSA and indexed hemodynamics. Not a clinical report.',
  asideAriaLabel: 'Interactive Stroke Volume Calculator',
  tocItems: STROKE_VOLUME_TOC_ITEMS,
  GuideArticle: StrokeVolumeGuideArticle,
  faqs: STROKE_VOLUME_FAQS,
  countryRules: null,
};
