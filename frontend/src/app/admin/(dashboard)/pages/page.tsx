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
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { EmptyState } from '@/components/admin/shared/EmptyState';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Eye, Edit, X, Save } from 'lucide-react';
import { INITIAL_ADMIN_CMS_PAGES, type AdminCMSPage } from '@/lib/admin-mock-data';

export default function AdminPagesPage() {
  const [pages] = React.useState<AdminCMSPage[]>(INITIAL_ADMIN_CMS_PAGES);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [editingPage, setEditingPage] = React.useState<AdminCMSPage | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pages, searchQuery, statusFilter]);

  const handleCreatePage = () => {
    setNoticeMessage(
      'New CMS Page creation simulated. Dynamic page routing and markdown rendering will be wired in future development phases.'
    );
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      setNoticeMessage(
        `Changes to page '${editingPage.title}' simulated. Content persistence to MongoDB is scheduled for the CMS backend phase.`
      );
      setEditingPage(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="CMS Pages Management"
        description="Manage static and informational pages such as About, Privacy Policy, and Terms of Service."
      >
        <Button
          type="button"
          size="sm"
          onClick={handleCreatePage}
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create New Page</span>
        </Button>
      </AdminPageHeader>

      <PendingNotice message="CMS management interface in UI validation mode. Page content rendering is statically baked in this phase and CMS persistence is pending." />

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Filters */}
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search pages by title or slug..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ]}
        hasActiveFilters={Boolean(searchQuery || statusFilter)}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('');
        }}
      />

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No pages match your search"
          description="Try a different query or clear the status filter."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('');
          }}
        />
      ) : (
        <DataTable>
          <DataTableHeader>
            <tr>
              <DataTableHeadCell>Page Title</DataTableHeadCell>
              <DataTableHeadCell>URL Path</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
              <DataTableHeadCell>SEO Health</DataTableHeadCell>
              <DataTableHeadCell>Page Views</DataTableHeadCell>
              <DataTableHeadCell>Updated</DataTableHeadCell>
              <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
            </tr>
          </DataTableHeader>
          <DataTableBody>
            {filtered.map((page) => (
              <DataTableRow key={page.id}>
                <DataTableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-accent">{page.title}</span>
                  </div>
                </DataTableCell>
                <DataTableCell className="font-mono text-muted-foreground text-[11px]">
                  {page.slug}
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={page.status} />
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={page.seoStatus} />
                </DataTableCell>
                <DataTableCell className="text-muted-foreground text-[11px]">
                  {page.views.toLocaleString()}
                </DataTableCell>
                <DataTableCell className="text-muted-foreground text-[11px]">
                  {page.updatedDate}
                </DataTableCell>
                <DataTableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={page.slug}
                      target="_blank"
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      title="View public page"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditingPage(page)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      title="Quick edit metadata"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      )}

      {/* Quick Edit Drawer */}
      {editingPage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEditingPage(null)}
        >
          <form
            onSubmit={handleSavePage}
            className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-accent text-base">Edit Page: {editingPage.title}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{editingPage.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-accent mb-1">Page Title</label>
                <Input
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-accent mb-1">
                  URL Path Slug
                </label>
                <Input
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-accent mb-1">
                  Body Content (Markdown Preview)
                </label>
                <Textarea
                  defaultValue="# Content Header&#10;&#10;Informational editorial copy..."
                  rows={4}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingPage(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
