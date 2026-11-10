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
import { ExecutionTypeBadge } from '@/components/admin/shared/ExecutionTypeBadge';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { EmptyState } from '@/components/admin/shared/EmptyState';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Plus, Wrench, Star, ArrowUpDown } from 'lucide-react';
import {
  INITIAL_ADMIN_TOOLS,
  INITIAL_ADMIN_CATEGORIES,
  type AdminTool,
} from '@/lib/admin-mock-data';

export default function AdminToolsPage() {
  const [tools] = React.useState<AdminTool[]>(INITIAL_ADMIN_TOOLS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [executionFilter, setExecutionFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'category' | 'updatedDate'>(
    'updatedDate'
  );
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 8;

  // Selected records for bulk operations
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = React.useState<AdminTool | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  // Filtering & Sorting
  const filtered = React.useMemo(() => {
    return tools
      .filter((tool) => {
        const matchesSearch =
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.componentKey.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = !categoryFilter || tool.categorySlug === categoryFilter;
        const matchesExec = !executionFilter || tool.executionType === executionFilter;
        const matchesStatus = !statusFilter || tool.status === statusFilter;
        return matchesSearch && matchesCat && matchesExec && matchesStatus;
      })
      .sort((a, b) => {
        const mult = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'name') return mult * a.name.localeCompare(b.name);
        if (sortField === 'category') return mult * a.categoryName.localeCompare(b.categoryName);
        return mult * a.updatedDate.localeCompare(b.updatedDate);
      });
  }, [tools, searchQuery, categoryFilter, executionFilter, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'name' | 'category' | 'updatedDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginated.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setNoticeMessage(
        `Tool unregistration for '${deleteTarget.name}' simulated. In this UI phase, records are not removed from MongoDB.`
      );
      setDeleteTarget(null);
    }
  };

  const handleBulkAction = (action: string) => {
    setNoticeMessage(
      `Bulk operation '${action}' for ${selectedIds.length} tools simulated. Backend pipeline pending.`
    );
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tool Management"
        description="Configure runtime execution architectures, bind component keys, and update tool metadata."
      >
        <Button
          asChild
          size="sm"
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <Link href="/admin/tools/new">
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Tool</span>
          </Link>
        </Button>
      </AdminPageHeader>

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Filters */}
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search tools by title, slug, or component key..."
        categoryFilter={categoryFilter}
        onCategoryChange={(c) => {
          setCategoryFilter(c);
          setCurrentPage(1);
        }}
        categoryOptions={INITIAL_ADMIN_CATEGORIES.map((c) => ({ label: c.name, value: c.slug }))}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        statusOptions={[
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
          { label: 'Disabled', value: 'disabled' },
        ]}
        extraFilters={
          <div className="w-full sm:w-40">
            <Select
              value={executionFilter}
              onChange={(e) => {
                setExecutionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 text-xs"
            >
              <option value="">All Runtimes</option>
              <option value="client">Client-Side</option>
              <option value="server">Server Pipeline</option>
              <option value="third-party">Third-Party API</option>
            </Select>
          </div>
        }
        hasActiveFilters={Boolean(searchQuery || categoryFilter || executionFilter || statusFilter)}
        onReset={() => {
          setSearchQuery('');
          setCategoryFilter('');
          setExecutionFilter('');
          setStatusFilter('');
          setCurrentPage(1);
        }}
      />

      {/* Bulk action toolbar if items selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-secondary/50 px-4 py-2.5 text-xs animate-in fade-in">
          <span className="font-semibold text-primary">{selectedIds.length} tools selected</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('Publish')}
              className="h-7 text-xs bg-white text-primary"
            >
              Publish Selected
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('Unpublish / Draft')}
              className="h-7 text-xs bg-white"
            >
              Move to Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('Delete')}
              className="h-7 text-xs bg-white text-rose-600 hover:bg-rose-50"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table / Empty State */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No tools found"
          description="Adjust your search criteria, category filters, or register a new tool."
          actionLabel="Reset Search"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('');
            setExecutionFilter('');
            setStatusFilter('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-2">
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeadCell className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    aria-label="Select all visible tools"
                  />
                </DataTableHeadCell>
                <DataTableHeadCell>
                  <button
                    type="button"
                    onClick={() => toggleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    <span>Tool Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell>
                  <button
                    type="button"
                    onClick={() => toggleSort('category')}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    <span>Category</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell>Execution Engine</DataTableHeadCell>
                <DataTableHeadCell>Component Key</DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
                <DataTableHeadCell className="text-center">Featured</DataTableHeadCell>
                <DataTableHeadCell>
                  <button
                    type="button"
                    onClick={() => toggleSort('updatedDate')}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    <span>Updated</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </DataTableHeadCell>
                <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {paginated.map((tool) => {
                const isSelected = selectedIds.includes(tool.id);
                return (
                  <DataTableRow key={tool.id} className={isSelected ? 'bg-secondary/20' : ''}>
                    <DataTableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(tool.id, e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                        aria-label={`Select ${tool.name}`}
                      />
                    </DataTableCell>
                    <DataTableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                          <Wrench className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-accent">{tool.name}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">
                            /tools/{tool.slug}
                          </div>
                        </div>
                      </div>
                    </DataTableCell>
                    <DataTableCell>
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-accent">
                        {tool.categoryName}
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      <ExecutionTypeBadge type={tool.executionType} />
                    </DataTableCell>
                    <DataTableCell>
                      <span className="font-mono text-[11px] text-primary bg-secondary/50 px-2 py-0.5 rounded border border-teal-100">
                        {tool.componentKey}
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      <StatusBadge status={tool.status} />
                    </DataTableCell>
                    <DataTableCell className="text-center">
                      {tool.isFeatured ? (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </DataTableCell>
                    <DataTableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                      {tool.updatedDate}
                    </DataTableCell>
                    <DataTableCell className="text-right">
                      <RowActions
                        editHref={`/admin/tools/${tool.id}/edit`}
                        viewHref={`/tools/${tool.slug}`}
                        onDelete={() => setDeleteTarget(tool)}
                      />
                    </DataTableCell>
                  </DataTableRow>
                );
              })}
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
        title="Unregister Tool"
        description={`Are you sure you want to delete tool '${deleteTarget?.name}'? Its bound component key (${deleteTarget?.componentKey}) will remain in the codebase.`}
        confirmLabel="Delete Tool"
      />
    </div>
  );
}
