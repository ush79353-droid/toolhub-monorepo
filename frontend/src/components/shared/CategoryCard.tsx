import * as React from 'react';
import Link from 'next/link';
import { CategoryIcon } from './CategoryIcon';
import { ChevronRight } from 'lucide-react';
export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  description: string;
  toolCount?: number;
  icon?: string;
  iconUrl?: string;
}

export interface CategoryCardProps {
  category: CategoryCardData;
  className?: string;
}

export function CategoryCard({ category, className = '' }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md ${className}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary transition-colors ${category.iconUrl ? '' : 'group-hover:bg-primary group-hover:text-white'}`}
          >
            {category.iconUrl ? (
              <img src={category.iconUrl} alt="" className="h-5 w-5" />
            ) : (
              <CategoryIcon name={category.icon} className="h-5 w-5" />
            )}
          </div>
          <span className="rounded-full bg-background border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {category.toolCount ?? 0} {category.toolCount === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {category.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-semibold text-primary">
        <span>Explore Category</span>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
