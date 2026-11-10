import * as React from 'react';
import type { Metadata } from 'next';
import { CategoriesClient } from '@/components/categories/CategoriesClient';

export const metadata: Metadata = {
  title: 'Tool Categories — Browse by Utility Type',
  description:
    'Discover free online tools by category: Calculators, Unit Converters, PDF Tools, Image Utilities, Developer Tools, SEO Tools, and more.',
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
