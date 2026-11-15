import type { ComponentType } from 'react';
import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { ToolDetailSidebarCountryRules } from '@/components/shared/ToolDetailSidebar';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

/** Tool-specific page copy. The shared `/tools/[slug]` shell renders this. */
export interface ToolPageDetail {
  subtitleLead: string;
  asideAriaLabel: string;
  tocItems: readonly TableOfContentsItem[];
  GuideArticle: ComponentType;
  faqs: readonly FAQItem[];
  countryRules: ToolDetailSidebarCountryRules | null;
}
