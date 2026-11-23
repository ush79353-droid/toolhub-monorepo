import type { ToolPageDetail } from '@/tools/page-detail';
import { DopplerEchoCardiacOutputGuideArticle } from './DopplerEchoCardiacOutputGuideArticle';
import {
  DOPPLER_ECHO_CARDIAC_OUTPUT_FAQS,
  DOPPLER_ECHO_CARDIAC_OUTPUT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational LVOT Doppler stroke volume, cardiac output, and index with Mosteller BSA — not a clinical echo report.',
  asideAriaLabel: 'Interactive Doppler Echo Cardiac Output Calculator',
  tocItems: DOPPLER_ECHO_CARDIAC_OUTPUT_TOC_ITEMS,
  GuideArticle: DopplerEchoCardiacOutputGuideArticle,
  faqs: DOPPLER_ECHO_CARDIAC_OUTPUT_FAQS,
  countryRules: null,
};