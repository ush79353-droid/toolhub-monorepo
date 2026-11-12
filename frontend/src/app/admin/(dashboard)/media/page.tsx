'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { TableFilters } from '@/components/admin/tables/TableFilters';
import { TablePagination } from '@/components/admin/tables/TablePagination';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { EmptyState } from '@/components/admin/shared/EmptyState';
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
  Loader2,
} from 'lucide-react';
import {
  confirmMediaUploadAction,
  deleteMediaAction,
  listMediaAction,
  requestMediaUploadAction,
  type MediaAsset,
} from '@/server/media/actions';

const PAGE_SIZE = 24;
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
]);

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function fileIcon(fileType: string) {
  if (fileType.includes('svg')) return <FileCode className="h-8 w-8 text-primary" />;
  if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-rose-500" />;
  return <ImageIcon className="h-8 w-8 text-teal-600" />;
}

function AssetPreview({ item, className }: { item: MediaAsset; className: string }) {
  const [failed, setFailed] = React.useState(false);
  const showImage = item.fileType.startsWith('image/') && !failed;
  return (
    <div className={className}>
      {showImage ? (
        <img
          src={item.url}
          alt={item.altText || item.fileName}
          className="max-h-full max-w-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        fileIcon(item.fileType)
      )}
    </div>
  );
}

type UploadRow = {
  id: string;
  name: string;
  progress: number;
  status: 'queued' | 'uploading' | 'saving' | 'done' | 'error';
};

function putWithProgress(
  url: string,
  file: File,
  contentType: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url);
    request.setRequestHeader('Content-Type', contentType);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error('storage rejected the upload'));
    };
    request.onerror = () => reject(new Error('upload failed'));
    request.send(file);
  });
}

async function imageSize(file: File): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return {};
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return {};
  }
}

export default function AdminMediaPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [items, setItems] = React.useState<MediaAsset[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [uploads, setUploads] = React.useState<UploadRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = React.useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MediaAsset | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const load = React.useCallback(async () => {
    setLoading(true);
    const result = await listMediaAction({ page, limit: PAGE_SIZE, search, type: typeFilter });
    if (!result.success || !result.data) {
      setError(result.error || 'Failed to load media.');
      setItems([]);
    } else {
      setError(null);
      setItems(result.data.items);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    }
    setLoading(false);
  }, [page, search, typeFilter]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const patchUpload = (id: string, patch: Partial<UploadRow>) => {
    setUploads((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const uploadFiles = async (files: File[]) => {
    const rows: UploadRow[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      progress: 0,
      status: 'queued',
    }));
    setUploads(rows);
    setUploading(true);
    setError(null);
    const failures: string[] = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const row = rows[index];
      const contentType = file.type === 'image/jpg' ? 'image/jpeg' : file.type;
      if (!ALLOWED_TYPES.has(file.type) && contentType !== 'image/jpeg') {
        patchUpload(row.id, { status: 'error' });
        failures.push(`${file.name}: use PNG, JPEG, WebP, SVG, GIF, or PDF.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        patchUpload(row.id, { status: 'error' });
        failures.push(`${file.name}: must be 10 MB or smaller.`);
        continue;
      }
      patchUpload(row.id, { status: 'uploading' });
      const ticket = await requestMediaUploadAction({
        fileName: file.name,
        contentType,
        size: file.size,
      });
      if (!ticket.success || !ticket.data) {
        patchUpload(row.id, { status: 'error' });
        failures.push(`${file.name}: ${ticket.error || 'could not start upload.'}`);
        continue;
      }
      try {
        await putWithProgress(ticket.data.uploadUrl, file, ticket.data.contentType, (progress) => {
          patchUpload(row.id, { progress, status: 'uploading' });
        });
      } catch {
        patchUpload(row.id, { status: 'error' });
        failures.push(`${file.name}: storage rejected the upload.`);
        continue;
      }
      patchUpload(row.id, { progress: 100, status: 'saving' });
      const size = await imageSize(file);
      const saved = await confirmMediaUploadAction({
        key: ticket.data.key,
        fileName: file.name,
        contentType: ticket.data.contentType,
        width: size.width,
        height: size.height,
      });
      if (!saved.success) {
        patchUpload(row.id, { status: 'error' });
        failures.push(`${file.name}: ${saved.error || 'could not save the asset.'}`);
        continue;
      }
      patchUpload(row.id, { progress: 100, status: 'done' });
    }
    setUploading(false);
    if (failures.length) setError(failures.join(' '));
    setPage(1);
    if (page === 1) await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteMediaAction(deleteTarget.id);
    if (!result.success) {
      setError(result.error || 'Failed to delete the asset.');
      return;
    }
    setDeleteTarget(null);
    if (selectedItem?.id === deleteTarget.id) setSelectedItem(null);
    if (items.length === 1 && page > 1) setPage(page - 1);
    else await load();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        description="Images and documents for tools and the site."
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf"
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = '';
              if (files.length) void uploadFiles(files);
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 bg-primary text-xs text-white hover:bg-[hsl(var(--primary-hover))]"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            <span>{uploading ? 'Uploading' : 'Upload Asset'}</span>
          </Button>
        </div>
      </AdminPageHeader>

      {uploads.length > 0 && (
        <div className="space-y-3 rounded-xl border border-border bg-white p-4">
          {uploads.map((row) => (
            <div key={row.id}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-accent">{row.name}</span>
                <span className={row.status === 'error' ? 'text-rose-600' : 'text-muted-foreground'}>
                  {row.status === 'queued' && 'Waiting'}
                  {row.status === 'uploading' && `${row.progress}%`}
                  {row.status === 'saving' && 'Saving'}
                  {row.status === 'done' && 'Done'}
                  {row.status === 'error' && 'Failed'}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-[width] duration-150 ${
                    row.status === 'error' ? 'bg-rose-500' : 'bg-primary'
                  }`}
                  style={{ width: `${row.status === 'saving' || row.status === 'done' ? 100 : row.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <TableFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search media by filename or alt description..."
        statusFilter={typeFilter}
        onStatusChange={(value) => {
          setPage(1);
          setTypeFilter(value);
        }}
        statusOptions={[
          { label: 'PNG Images', value: 'png' },
          { label: 'JPEG Images', value: 'jpeg' },
          { label: 'SVG Vectors', value: 'svg' },
          { label: 'WebP Images', value: 'webp' },
          { label: 'GIF Images', value: 'gif' },
          { label: 'PDF Documents', value: 'pdf' },
        ]}
        hasActiveFilters={Boolean(searchInput || typeFilter)}
        onReset={() => {
          setSearchInput('');
          setSearch('');
          setTypeFilter('');
          setPage(1);
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading media
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No media files found"
          description={
            search || typeFilter
              ? 'Try a different filename or file type.'
              : 'Upload a PNG, JPEG, WebP, SVG, GIF, or PDF. The file goes straight to S3.'
          }
          actionLabel={search || typeFilter ? 'Clear Filters' : undefined}
          onAction={
            search || typeFilter
              ? () => {
                  setSearchInput('');
                  setSearch('');
                  setTypeFilter('');
                  setPage(1);
                }
              : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <AssetPreview
                item={item}
                className="flex h-32 items-center justify-center border-b border-border/60 bg-muted/30 p-3"
              />
              <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <h4 className="truncate text-xs font-semibold text-accent" title={item.fileName}>
                    {item.fileName}
                  </h4>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{formatBytes(item.size)}</span>
                    <span>{item.width && item.height ? `${item.width}×${item.height}` : '—'}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
                  <span className="text-[10px] text-muted-foreground/70">{formatDate(item.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                      title="Inspect asset"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="rounded p-1 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
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
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary [&>svg]:h-4 [&>svg]:w-4">
                        {fileIcon(item.fileType)}
                      </div>
                      <span className="font-semibold text-accent">{item.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{item.fileType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatBytes(item.size)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.width && item.height ? `${item.width}×${item.height}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
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

      {!loading && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 backdrop-blur-xs fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg space-y-4 rounded-xl border border-border bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-accent">{selectedItem.fileName}</h3>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block truncate font-mono text-xs text-primary hover:underline"
                >
                  {selectedItem.url}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AssetPreview
              item={selectedItem}
              className="flex h-44 items-center justify-center rounded-lg border border-border bg-muted/40"
            />
            <div className="divide-y divide-border text-xs">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">MIME Type</span>
                <span className="font-mono text-accent">{selectedItem.fileType}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">File Size</span>
                <span className="text-accent">{formatBytes(selectedItem.size)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Dimensions</span>
                <span className="text-accent">
                  {selectedItem.width && selectedItem.height
                    ? `${selectedItem.width}×${selectedItem.height}`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-muted-foreground">Alt text</span>
                <span className="text-right text-accent">{selectedItem.altText || '—'}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        description={`Delete '${deleteTarget?.fileName ?? ''}' from the library and from storage?`}
        confirmLabel="Delete Asset"
      />
    </div>
  );
}
