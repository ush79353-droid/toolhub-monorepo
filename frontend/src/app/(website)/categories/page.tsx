import type { Metadata } from 'next';
import { CategoriesClient } from '@/components/categories/CategoriesClient';
import { getPublicCategories } from '@/server/catalog/categories';

export const metadata: Metadata = {
  title: 'Tool Categories — Browse by Utility Type',
  description:
    'Discover free online tools by category: Calculators, Unit Converters, PDF Tools, Image Utilities, Developer Tools, SEO Tools, and more.',
};

export default async function CategoriesPage() {
  const categories = await getPublicCategories();
  return <CategoriesClient categories={categories} />;
}
