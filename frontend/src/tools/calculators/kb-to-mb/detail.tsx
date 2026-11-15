import type { ToolPageDetail } from '@/tools/page-detail';
import { KbToMbGuideArticle } from './KbToMbGuideArticle';
import { KB_MB_FAQS, KB_MB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilobytes to megabytes with clear SI (MB) and IEC binary (MiB) results from a shared byte value.',
  asideAriaLabel: 'Interactive kB to MB converter',
  tocItems: KB_MB_TOC_ITEMS,
  GuideArticle: KbToMbGuideArticle,
  faqs: KB_MB_FAQS,
  countryRules: null,
};
