import type { ToolCategory } from './tool';

export interface CategoryMetadata {
  id: string;
  name: string;
  slug: ToolCategory | string;
  description: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  toolCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
