import type { ToolPageDetail } from '@/tools/page-detail';
import { MbToGbGuideArticle } from './MbToGbGuideArticle';
import { MB_GB_FAQS, MB_GB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert megabytes to gigabytes with SI decimal (÷1000) or legacy binary (÷1024) modes. MB/GB are not MiB/GiB.',
  asideAriaLabel: 'Interactive MB to GB converter',
  tocItems: MB_GB_TOC_ITEMS,
  GuideArticle: MbToGbGuideArticle,
  faqs: MB_GB_FAQS,
  countryRules: null,
};
