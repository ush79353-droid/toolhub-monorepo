export type ToolExecutionType = 'client' | 'server' | 'third-party';

export type ToolCategory =
  | 'calculators'
  | 'converters'
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'ai'
  | 'seo'
  | 'developer';

export interface ToolMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  executionType: ToolExecutionType;
  componentKey: string;
  version: string;
  isPremium?: boolean;
  isActive: boolean;
  icon?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

