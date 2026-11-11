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
import { buttonVariants } from '@/components/ui/button';
import { Plus, Star, ArrowUpDown, Loader2, ImageIcon } from 'lucide-react';
import {
  deleteToolAction,
  listToolPlacementAction,
  listToolsAction,
  type PlacementNode,
  type ToolRecord,
} from '@/server/tools/actions';

const PAGE_SIZE = 10;

export default function AdminToolsPage() {
  const [items, setItems] = React.useState<ToolRecord[]>([]);
  const [placement, setPlacement] = React.useState<PlacementNode[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [sort, setSort] = React.useState<'name' | 'updatedAt'>('updatedAt');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ToolRecord | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  React.useEffect(() => {
    listToolPlacementAction().then((result) => {
      if (result.success && result.data) setPlacement(result.data);
    });
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    const result = await listToolsAction({
      page,
      limit: PAGE_SIZE,
      search,
      categoryId,
      status,
      sort,
      order,
    });
    if (!result.success || !result.data) {
      setError(result.error || 'Failed to load tools.');
      setItems([]);
    } else {
      setError(null);
      setItems(result.data.items);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    }
    setLoading(false);
  }, [page, search, categoryId, status, sort, order]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const toggleSort = (field: 'name' | 'updatedAt') => {
    if (sort === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSort(field);
      setOrder('asc');
    }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteToolAction(deleteTarget.id);
    if (!result.success) {
      setError(result.error || 'Failed to delete the tool.');
      return;
    }
    setDeleteTarget(null);
    if (items.length === 1 && page > 1) setPage(page - 1);
    else await load();
  };

  const categories = placement.filter((item) => item.kind === 'category');

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tool Management" description="Catalog records for each calculator. The calculator code itself stays in the project.">
        <Link
          href="/admin/tools/new"
          className={buttonVariants({
            size: 'sm',
            className: 'inline-flex items-center gap-1.5 bg-primary text-xs text-white hover:bg-primary-hover',
          })}
        >
          <Plus className="h-3.5 w-3.5" />
          Add new tool
        </Link>
      </AdminPageHeader>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <TableFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search tools by name or slug"
        categoryFilter={categoryId}
        onCategoryChange={(value) => {
          setCategoryId(value);
          setPage(1);
        }}
        categoryOptions={categories.map((item) => ({ label: item.name, value: item.id }))}
        statusFilter={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        statusOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        hasActiveFilters={Boolean(searchInput || categoryId || status)}
        onReset={() => {
          setSearchInput('');
          setSearch('');
          setCategoryId('');
          setStatus('');
          setPage(1);
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading tools
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No tools found"
          description={search || categoryId || status ? 'Try a different filter.' : 'Add the first tool record.'}
          actionLabel={search || categoryId || status ? 'Reset filters' : undefined}
          onAction={
            search || categoryId || status
              ? () => {
                  setSearchInput('');
                  setSearch('');
                  setCategoryId('');
                  setStatus('');
                  setPage(1);
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeadCell>
                  <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 hover:text-accent">
                    Tool
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell>Category</DataTableHeadCell>
                <DataTableHeadCell>Pillar</DataTableHeadCell>
                <DataTableHeadCell>Sub-pillar</DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
                <DataTableHeadCell className="text-center">Featured</DataTableHeadCell>
                <DataTableHeadCell>
                  <button type="button" onClick={() => toggleSort('updatedAt')} className="inline-flex items-center gap-1 hover:text-accent">
                    Updated
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {items.map((tool) => (
                <DataTableRow key={tool.id}>
                  <DataTableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                        {tool.iconUrl ? (
                          <img src={tool.iconUrl} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <ImageIcon className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-accent">{tool.name}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">/tools/{tool.slug}</div>
                      </div>
                    </div>
                  </DataTableCell>
                  <DataTableCell>{tool.category?.name ?? '—'}</DataTableCell>
                  <DataTableCell>{tool.pillar?.name ?? '—'}</DataTableCell>
                  <DataTableCell>{tool.subPillar?.name ?? '—'}</DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={tool.isActive ? 'active' : 'inactive'} />
                  </DataTableCell>
                  <DataTableCell className="text-center">
                    {tool.isFeatured ? <Star className="mx-auto h-4 w-4 fill-amber-400 text-amber-500" /> : <span className="text-xs text-muted-foreground/40">—</span>}
                  </DataTableCell>
                  <DataTableCell className="whitespace-nowrap text-[11px] text-muted-foreground">
                    {new Date(tool.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <RowActions editHref={`/admin/tools/${tool.id}/edit`} onDelete={() => setDeleteTarget(tool)} />
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
          <TablePagination currentPage={page} totalPages={totalPages} totalRecords={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete tool"
        description={`Delete '${deleteTarget?.name ?? ''}' from the catalog? The calculator code stays in the project.`}
        confirmLabel="Delete tool"
      />
    </div>
  );
}
