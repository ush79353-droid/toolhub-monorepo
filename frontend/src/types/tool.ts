export type ToolExecutionType = 'client' | 'server' | 'third-party';

export type ToolCategory =
  | 'calculators'
  | 'converters'
  | 'pdf'
  | 'image'
  | 'text'
  | 'seo'
  | 'developer'
  | 'ai'
  | 'video'
  | 'audio'
  | 'security'
  | 'productivity';

export interface ToolMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ToolCategory | (string & {});
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
