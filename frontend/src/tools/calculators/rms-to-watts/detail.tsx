import type { ToolPageDetail } from '@/tools/page-detail';
import { RmsToWattsGuideArticle } from './RmsToWattsGuideArticle';
import { RMS_FAQS, RMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert RMS and peak values of a sinusoidal power waveform, or estimate electrical power from RMS voltage, current, resistance, and power factor.',
  asideAriaLabel: 'Interactive RMS to watts converter',
  tocItems: RMS_TOC_ITEMS,
  GuideArticle: RmsToWattsGuideArticle,
  faqs: RMS_FAQS,
  countryRules: null,
};
