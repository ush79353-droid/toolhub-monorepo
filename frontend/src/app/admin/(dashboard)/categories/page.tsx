'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableHeadCell,
} from '@/components/admin/tables/DataTable';
import { TableFilters } from '@/components/admin/tables/TableFilters';
import { TablePagination } from '@/components/admin/tables/TablePagination';
import { RowActions } from '@/components/admin/tables/RowActions';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { EmptyState } from '@/components/admin/shared/EmptyState';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import { Plus, Layers, ArrowUpDown } from 'lucide-react';
import { INITIAL_ADMIN_CATEGORIES, type AdminCategory } from '@/lib/admin-mock-data';

export default function AdminCategoriesPage() {
  const [categories] = React.useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'toolCount' | 'sortOrder'>('sortOrder');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 6;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = React.useState<AdminCategory | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  // Filter & sort
  const filtered = React.useMemo(() => {
    return categories
      .filter((cat) => {
        const matchesSearch =
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || cat.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const mult = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'name') return mult * a.name.localeCompare(b.name);
        if (sortField === 'toolCount') return mult * (a.toolCount - b.toolCount);
        return mult * (a.sortOrder - b.sortOrder);
      });
  }, [categories, searchQuery, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'name' | 'toolCount' | 'sortOrder') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setNoticeMessage(
        `Category deletion for '${deleteTarget.name}' simulated. In this UI phase, records are not removed from backend database.`
      );
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Category Management"
        description="Organize public tool classifications, navigation hierarchies, and category SEO."
      >
        <Button
          asChild
          size="sm"
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <Link href="/admin/categories/new">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Category</span>
          </Link>
        </Button>
      </AdminPageHeader>

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Filters Bar */}
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search categories by name, slug, or description..."
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        statusOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        hasActiveFilters={Boolean(searchQuery || statusFilter)}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('');
          setCurrentPage(1);
        }}
      />

      {/* Table / Empty State */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No categories match your filter"
          description="Try adjusting your search terms or clearing the status filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-2">
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeadCell>
                  <button
                    type="button"
                    onClick={() => toggleSort('sortOrder')}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    <span>Order</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell>
                  <button
                    type="button"
                    onClick={() => toggleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    <span>Category</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell>URL Slug</DataTableHeadCell>
                <DataTableHeadCell>Description</DataTableHeadCell>
                <DataTableHeadCell>
                  <button
                    type="button"
                    onClick={() => toggleSort('toolCount')}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    <span>Tools</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
                <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {paginated.map((cat) => (
                <DataTableRow key={cat.id}>
                  <DataTableCell className="font-mono text-muted-foreground w-16">
                    #{cat.sortOrder}
                  </DataTableCell>
                  <DataTableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Layers className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-accent">{cat.name}</span>
                    </div>
                  </DataTableCell>
                  <DataTableCell className="font-mono text-muted-foreground text-[11px]">
                    /categories/{cat.slug}
                  </DataTableCell>
                  <DataTableCell className="max-w-xs truncate text-muted-foreground text-[11px]">
                    {cat.description}
                  </DataTableCell>
                  <DataTableCell>
                    <span className="rounded-full bg-muted px-2 py-0.5 font-semibold text-accent text-[11px]">
                      {cat.toolCount} tools
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={cat.status} />
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <RowActions
                      editHref={`/admin/categories/${cat.id}/edit`}
                      viewHref={`/categories/${cat.slug}`}
                      onDelete={() => setDeleteTarget(cat)}
                    />
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        description={`Are you sure you want to delete category '${deleteTarget?.name}'? Tools assigned to this category will need to be reassigned.`}
        confirmLabel="Delete Category"
      />
    </div>
  );
}
