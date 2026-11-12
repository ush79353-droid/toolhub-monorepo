'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { TablePagination } from '@/components/admin/tables/TablePagination';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  deleteCategoryAction,
  listCategoriesAction,
  type CategoryKind,
  type CategoryNode,
} from '@/server/categories/actions';

const PAGE_SIZE = 10;

const KIND_LABEL: Record<CategoryKind, string> = {
  category: 'Category',
  pillar: 'Pillar',
  sub_pillar: 'Sub-pillar',
};

function TreeNode({
  node,
  depth,
  onDelete,
}: {
  node: CategoryNode;
  depth: number;
  onDelete: (node: CategoryNode) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {node.children.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="w-5" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-accent">{node.name}</span>
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              {KIND_LABEL[node.kind]}
            </span>
          </div>
          <p className="truncate text-[11px] text-muted-foreground">
            /{node.slug}
            {node.description ? ` · ${node.description}` : ''}
          </p>
        </div>
        <Link
          href={`/admin/categories/${node.id}/edit`}
          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Edit ${node.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(node)}
          className="rounded p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Delete ${node.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {open &&
        node.children.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} onDelete={onDelete} />
        ))}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [items, setItems] = React.useState<CategoryNode[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CategoryNode | null>(null);

  const applyFilter = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const resetFilter = () => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  };

  const load = React.useCallback(async () => {
    setLoading(true);
    const result = await listCategoriesAction({ page, limit: PAGE_SIZE, search });
    if (!result.success || !result.data) {
      setError(result.error || 'Failed to load categories.');
      setItems([]);
    } else {
      setError(null);
      setItems(result.data.items);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    }
    setLoading(false);
  }, [page, search]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteCategoryAction(deleteTarget.id);
    if (!result.success) {
      setError(result.error || 'Failed to delete.');
      return;
    }
    setDeleteTarget(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Category Management"
        description="A category holds pillars. A pillar can stand alone or contain sub-pillars."
      >
        <Link
          href="/admin/categories/new"
          className={buttonVariants({
            size: 'sm',
            className: 'inline-flex items-center gap-1.5 bg-primary text-xs text-white hover:bg-primary-hover',
          })}
        >
          <Plus className="h-3.5 w-3.5" />
          Add new
        </Link>
      </AdminPageHeader>

      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          applyFilter();
        }}
      >
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search categories, pillars, or sub-pillars"
        />
        <Button type="submit" className="shrink-0">
          Filter
        </Button>
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={resetFilter}
          disabled={!search && !searchInput}
        >
          Reset
        </Button>
      </form>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="rounded-xl border border-border bg-white p-2">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading categories
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No categories match this page.</p>
        ) : (
          items.map((node) => <TreeNode key={node.id} node={node} depth={0} onDelete={setDeleteTarget} />)
        )}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget ? KIND_LABEL[deleteTarget.kind] : 'item'}?`}
        description={
          deleteTarget?.children.length
            ? `"${deleteTarget.name}" and everything under it will be removed.`
            : `"${deleteTarget?.name ?? ''}" will be removed.`
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
