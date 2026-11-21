import type { ToolPageDetail } from '@/tools/page-detail';
import { PintsToCupsGuideArticle } from './PintsToCupsGuideArticle';
import { PINTS_TO_CUPS_FAQS, PINTS_TO_CUPS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US pints to cups (and back) with US, metric, and UK cups plus US liquid, US dry, and imperial pints.',
  asideAriaLabel: 'Interactive pints to cups converter',
  tocItems: PINTS_TO_CUPS_TOC_ITEMS,
  GuideArticle: PintsToCupsGuideArticle,
  faqs: PINTS_TO_CUPS_FAQS,
  countryRules: null,
};
