'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { TableFilters } from '@/components/admin/tables/TableFilters';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { EmptyState } from '@/components/admin/shared/EmptyState';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import {
  Upload,
  LayoutGrid,
  List,
  FileText,
  Image as ImageIcon,
  Trash2,
  Eye,
  X,
  FileCode,
} from 'lucide-react';
import { INITIAL_ADMIN_MEDIA, type AdminMediaItem } from '@/lib/admin-mock-data';

export default function AdminMediaPage() {
  const [mediaList] = React.useState<AdminMediaItem[]>(INITIAL_ADMIN_MEDIA);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<AdminMediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<AdminMediaItem | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return mediaList.filter((m) => {
      const matchesSearch =
        m.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.altText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !typeFilter || m.fileType.includes(typeFilter);
      return matchesSearch && matchesType;
    });
  }, [mediaList, searchQuery, typeFilter]);

  const handleUploadClick = () => {
    setNoticeMessage(
      'Media upload pipeline simulated. File processing with AWS S3 temporary buffering and automated image optimization will be activated during the backend integration phase.'
    );
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setNoticeMessage(
        `Asset deletion for '${deleteTarget.fileName}' simulated. No assets removed from storage in this UI phase.`
      );
      setDeleteTarget(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('svg')) return <FileCode className="h-8 w-8 text-primary" />;
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-rose-500" />;
    return <ImageIcon className="h-8 w-8 text-teal-600" />;
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        description="Central asset repository for tool icons, brand vectors, and Open Graph share cards."
      >
        <div className="flex items-center gap-2">
          {/* Grid / List toggle */}
          <div className="flex items-center rounded-lg border border-border bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleUploadClick}
            className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Asset</span>
          </Button>
        </div>
      </AdminPageHeader>

      <PendingNotice message="Media Library operates in development preview mode. Real asset uploads, AWS S3 buckets, and libvips optimization pipelines will be wired during storage integration." />

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Filters */}
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search media by filename or alt description..."
        statusFilter={typeFilter}
        onStatusChange={setTypeFilter}
        statusOptions={[
          { label: 'PNG Images', value: 'png' },
          { label: 'SVG Vectors', value: 'svg' },
          { label: 'WebP Images', value: 'webp' },
          { label: 'PDF Documents', value: 'pdf' },
        ]}
        hasActiveFilters={Boolean(searchQuery || typeFilter)}
        onReset={() => {
          setSearchQuery('');
          setTypeFilter('');
        }}
      />

      {/* Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No media files found"
          description="Try adjusting your search query or reset the file type filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setTypeFilter('');
          }}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xs hover:shadow-md hover:border-primary/40 transition-all"
            >
              {/* Thumbnail Container */}
              <div className="flex h-32 items-center justify-center bg-muted/30 p-4 border-b border-border/60">
                {getFileIcon(item.fileType)}
              </div>

              {/* Meta */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-accent text-xs truncate" title={item.fileName}>
                    {item.fileName}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{item.fileSize}</span>
                    <span>{item.dimensions}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
                  <span className="text-[10px] text-muted-foreground/70">{item.uploadDate}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      title="Inspect asset"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="rounded p-1 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">Upload Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                        {getFileIcon(item.fileType)}
                      </div>
                      <span className="font-semibold text-accent">{item.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {item.fileType}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.fileSize}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.dimensions}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.uploadDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="rounded p-1 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-accent text-base">{selectedItem.fileName}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedItem.url}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex h-44 items-center justify-center rounded-lg bg-muted/40 border border-border">
              {getFileIcon(selectedItem.fileType)}
            </div>

            <div className="divide-y divide-border text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">MIME Type</span>
                <span className="font-mono text-accent">{selectedItem.fileType}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">File Size</span>
                <span className="text-accent">{selectedItem.fileSize}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Resolution / Geometry</span>
                <span className="text-accent">{selectedItem.dimensions}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Alt Description</span>
                <span className="text-accent">{selectedItem.altText}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Media Asset"
        description={`Are you sure you want to delete '${deleteTarget?.fileName}'? Public tools referencing this asset URL will need updated images.`}
        confirmLabel="Delete Asset"
      />
    </div>
  );
}
