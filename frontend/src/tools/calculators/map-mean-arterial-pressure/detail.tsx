import type { ToolPageDetail } from '@/tools/page-detail';
import { MapGuideArticle } from './MapGuideArticle';
import { MAP_FAQS, MAP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate mean arterial pressure from cuff systolic and diastolic readings. Optional pulse pressure; teaching approximation only — not a treatment target.',
  asideAriaLabel: 'Interactive MAP (Mean Arterial Pressure) Calculator',
  tocItems: MAP_TOC_ITEMS,
  GuideArticle: MapGuideArticle,
  faqs: MAP_FAQS,
  countryRules: null,
};