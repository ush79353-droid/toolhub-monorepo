import type { ToolPageDetail } from '@/tools/page-detail';
import { ByteConversionGuideArticle } from './ByteConversionGuideArticle';
import { BYTE_FAQS, BYTE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert bytes to KB, MB, GB, bits, and binary units (KiB, MiB, GiB) with exact decimal and binary factors.',
  asideAriaLabel: 'Interactive byte conversion calculator',
  tocItems: BYTE_TOC_ITEMS,
  GuideArticle: ByteConversionGuideArticle,
  faqs: BYTE_FAQS,
  countryRules: null,
};
