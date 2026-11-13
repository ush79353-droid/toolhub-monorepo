'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, CircleOff, ClipboardCheck, Download, Loader2, RefreshCw, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeadCell,
  DataTableHeader,
  DataTableRow,
} from '@/components/admin/tables/DataTable';
import { TablePagination } from '@/components/admin/tables/TablePagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AuditRow, AuditStatus, StoredAudit } from '@/lib/tools-audit/classify';
import { runDevelopmentAuditAction } from '@/server/tools-audit/actions';

const PAGE_SIZE = 25;
const MISSING_PAGE_SIZE = 10;

type StatusFilter = 'all' | AuditStatus | 'missing_component' | 'broken_route';

const FILTERS: Array<{ id: StatusFilter; label: string }> = [
  { id: 'all', label: 'All Tools' },
  { id: 'developed', label: 'Developed' },
  { id: 'not_developed', label: 'Not Developed' },
  { id: 'needs_review', label: 'Needs Review' },
  { id: 'missing_component', label: 'Missing Components' },
  { id: 'broken_route', label: 'Broken Routes' },
];

function statusLabel(status: AuditStatus): string {
  if (status === 'developed') return 'Developed';
  if (status === 'not_developed') return 'Not Developed';
  return 'Needs Review';
}

function matchesFilter(row: AuditRow, filter: StatusFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'missing_component') return row.issueCode === 'missing_component';
  if (filter === 'broken_route') return row.issueCode === 'broken_route' || row.issueCode === 'broken_import';
  return row.status === filter;
}

function matchesQuery(row: AuditRow, query: string): boolean {
  if (!query) return true;
  const haystack = `${row.name} ${row.slug} ${row.componentPath}`.toLowerCase();
  return haystack.includes(query);
}

function csvCell(value: string | boolean): string {
  const text = String(value).replaceAll('"', '""');
  return `"${text}"`;
}

function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function rowsToCsv(rows: AuditRow[]): string {
  const header = ['Tool Name', 'Slug', 'Category', 'Component', 'Component Path', 'Route', 'isDeveloped', 'Audit Status', 'Issue'];
  const body = rows.map((row) =>
    [
      row.name,
      row.slug,
      row.category,
      row.component,
      row.componentPath,
      row.route,
      row.isDeveloped ? 'true' : 'false',
      statusLabel(row.status),
      row.issue,
    ]
      .map(csvCell)
      .join(',')
  );
  return [header.map(csvCell).join(','), ...body].join('\n');
}

function stamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function slugList(slugs: string[]) {
  if (slugs.length === 0) return <p className="text-xs text-muted-foreground">None since the previous audit.</p>;
  const shown = slugs.slice(0, 12);
  return (
    <ul className="space-y-1 text-xs text-foreground">
      {shown.map((slug) => (
        <li key={slug} className="truncate font-mono">
          {slug}
        </li>
      ))}
      {slugs.length > shown.length && <li className="text-muted-foreground">and {slugs.length - shown.length} more</li>}
    </ul>
  );
}

export function ToolsAuditDashboard({
  initial,
  loadError,
}: {
  initial: StoredAudit | null;
  loadError: string | null;
}) {
  const [report, setReport] = React.useState<StoredAudit | null>(initial);
  const [error, setError] = React.useState<string | null>(loadError);
  const [running, setRunning] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<StatusFilter>('all');
  const [category, setCategory] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [missingPage, setMissingPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!report) return [];
    const needle = query.trim().toLowerCase();
    return report.rows.filter((row) => {
      if (category !== 'all' && row.category !== category) return false;
      if (!matchesFilter(row, filter)) return false;
      return matchesQuery(row, needle);
    });
  }, [report, query, filter, category]);

  const missing = React.useMemo(
    () => (report ? report.rows.filter((row) => row.issueCode === 'missing_component') : []),
    [report]
  );

  React.useEffect(() => {
    setPage(1);
  }, [query, filter, category, report?.ranAt]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const missingPageCount = Math.max(1, Math.ceil(missing.length / MISSING_PAGE_SIZE));
  const safeMissingPage = Math.min(missingPage, missingPageCount);
  const visibleMissing = missing.slice((safeMissingPage - 1) * MISSING_PAGE_SIZE, safeMissingPage * MISSING_PAGE_SIZE);

  async function runAudit() {
    setRunning(true);
    setError(null);
    const result = await runDevelopmentAuditAction();
    setRunning(false);
    if (!result.success || !result.data) {
      setError(result.error || 'The audit could not be completed.');
      return;
    }
    setReport(result.data);
    setFilter('all');
    setCategory('all');
    setQuery('');
    setMissingPage(1);
  }

  function exportCsv() {
    if (!report) return;
    downloadFile(`omega-tools-audit-${report.ranAt.slice(0, 10)}.csv`, rowsToCsv(report.rows), 'text/csv;charset=utf-8');
  }

  function exportJson() {
    if (!report) return;
    downloadFile(
      `omega-tools-audit-${report.ranAt.slice(0, 10)}.json`,
      JSON.stringify(report.rows, null, 2),
      'application/json'
    );
  }

  function exportFull() {
    if (!report) return;
    downloadFile(
      `omega-tools-audit-report-${report.ranAt.slice(0, 10)}.json`,
      JSON.stringify(report, null, 2),
      'application/json'
    );
  }

  const totals = report?.totals;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tools development audit"
        description="Checks the catalog against the component registry, source files, and the shared tool route."
      >
        <Button type="button" onClick={runAudit} disabled={running}>
          {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardCheck className="mr-2 h-4 w-4" />}
          Start Audit
        </Button>
        <Button type="button" variant="outline" onClick={runAudit} disabled={running || !report}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Run Audit Again
        </Button>
      </AdminPageHeader>

      {running && (
        <div role="status" aria-live="polite" className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground">
          <div className="flex items-center gap-2 font-medium">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Scanning the component registry and catalog…
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/2 animate-pulse bg-primary" />
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {!report && !running && (
        <div className="rounded-xl border border-border bg-white p-6 text-sm text-muted-foreground">
          No audit has been saved yet. Start Audit reads the current source tree, or the build-time component manifest when source is not on this server. The initial <span className="font-mono">isDeveloped: true</span> value is only a default. It is not treated as proof that a calculator exists.
        </div>
      )}

      {report && totals && (
        <>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Last audit: {stamp(report.ranAt)}</span>
            <span className="rounded-full bg-secondary px-2 py-1 font-semibold text-foreground">
              {report.source === 'filesystem' ? 'Live source' : 'Build manifest'}
            </span>
            <span>{report.updatedCount} isDeveloped values written</span>
          </div>
          {report.warning && (
            <div role="status" className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground">
              {report.warning}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Total Tools" value={totals.total.toLocaleString()} icon={ClipboardCheck} />
            <StatCard title="Developed" value={totals.developed.toLocaleString()} icon={CheckCircle2} />
            <StatCard title="Not Developed" value={totals.notDeveloped.toLocaleString()} icon={CircleOff} />
            <StatCard title="Needs Review" value={totals.needsReview.toLocaleString()} icon={AlertTriangle} />
            <StatCard title="Verified Completion" value={`${totals.completionPercent}%`} icon={CheckCircle2} subtext="Developed ÷ total" />
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Verified developed tools</span>
              <span>{totals.completionPercent}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={totals.completionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Verified development completion"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, totals.completionPercent)}%` }} />
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-accent">Category progress</h2>
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeadCell>Category</DataTableHeadCell>
                  <DataTableHeadCell>Total</DataTableHeadCell>
                  <DataTableHeadCell>Developed</DataTableHeadCell>
                  <DataTableHeadCell>Pending</DataTableHeadCell>
                  <DataTableHeadCell>Needs Review</DataTableHeadCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {report.categories.map((item) => (
                  <DataTableRow key={item.category}>
                    <DataTableCell className="font-medium text-foreground">{item.category}</DataTableCell>
                    <DataTableCell>{item.total.toLocaleString()}</DataTableCell>
                    <DataTableCell>{item.developed.toLocaleString()}</DataTableCell>
                    <DataTableCell>{item.pending.toLocaleString()}</DataTableCell>
                    <DataTableCell>{item.needsReview.toLocaleString()}</DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-4">
              <h2 className="text-sm font-bold text-accent">Newly developed</h2>
              <p className="mb-3 mt-1 text-[11px] text-muted-foreground">Compared with the previous saved audit. The first audit has no baseline.</p>
              {slugList(report.newlyDeveloped)}
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <h2 className="text-sm font-bold text-accent">Regressed</h2>
              <p className="mb-3 mt-1 text-[11px] text-muted-foreground">Tools that were Developed last time and are not Developed now.</p>
              {slugList(report.regressed)}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-sm font-bold text-accent">Audit results</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Needs Review keeps the stored isDeveloped value. Completion counts only Developed.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Export CSV
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={exportJson}>
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Export JSON
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={exportFull}>
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download Full Audit Report
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, slug, or component path"
                  aria-label="Search audit results"
                  className="pl-9"
                />
              </div>
              <label className="text-xs font-medium text-muted-foreground">
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground lg:w-56"
                >
                  <option value="all">All categories</option>
                  {report.categories.map((item) => (
                    <option key={item.category} value={item.category}>
                      {item.category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    filter === item.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                  }`}
                  aria-pressed={filter === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <DataTable>
              <caption className="sr-only">Tool development audit results</caption>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeadCell>Tool Name</DataTableHeadCell>
                  <DataTableHeadCell>Slug</DataTableHeadCell>
                  <DataTableHeadCell>Category</DataTableHeadCell>
                  <DataTableHeadCell>Component</DataTableHeadCell>
                  <DataTableHeadCell>Component Path</DataTableHeadCell>
                  <DataTableHeadCell>Route</DataTableHeadCell>
                  <DataTableHeadCell>isDeveloped</DataTableHeadCell>
                  <DataTableHeadCell>Audit Status</DataTableHeadCell>
                  <DataTableHeadCell>Issue</DataTableHeadCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {visible.length === 0 ? (
                  <DataTableRow>
                    <DataTableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      No tools match this filter.
                    </DataTableCell>
                  </DataTableRow>
                ) : (
                  visible.map((row) => (
                    <DataTableRow key={`${row.id}-${row.slug}`}>
                      <DataTableCell className="max-w-[220px] font-medium text-foreground">{row.name}</DataTableCell>
                      <DataTableCell className="max-w-[180px] font-mono">{row.slug}</DataTableCell>
                      <DataTableCell>{row.category}</DataTableCell>
                      <DataTableCell className="font-mono">{row.component}</DataTableCell>
                      <DataTableCell className="max-w-[240px] font-mono">{row.componentPath || '—'}</DataTableCell>
                      <DataTableCell className="font-mono">{row.route}</DataTableCell>
                      <DataTableCell>{row.isDeveloped ? 'True' : 'False'}</DataTableCell>
                      <DataTableCell>{statusLabel(row.status)}</DataTableCell>
                      <DataTableCell className="max-w-[280px]">{row.issue || '—'}</DataTableCell>
                    </DataTableRow>
                  ))
                )}
              </DataTableBody>
            </DataTable>
            <TablePagination
              currentPage={safePage}
              totalPages={pageCount}
              totalRecords={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-accent">Missing components</h2>
            <p className="text-[11px] text-muted-foreground">{missing.length.toLocaleString()} tools have no component file wired to their route.</p>
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeadCell>Tool Name</DataTableHeadCell>
                  <DataTableHeadCell>Slug</DataTableHeadCell>
                  <DataTableHeadCell>Expected Path</DataTableHeadCell>
                  <DataTableHeadCell>Details</DataTableHeadCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {visibleMissing.length === 0 ? (
                  <DataTableRow>
                    <DataTableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                      No missing components in this audit.
                    </DataTableCell>
                  </DataTableRow>
                ) : (
                  visibleMissing.map((row) => (
                    <DataTableRow key={`missing-${row.id}-${row.slug}`}>
                      <DataTableCell className="font-medium text-foreground">{row.name}</DataTableCell>
                      <DataTableCell className="font-mono">{row.slug}</DataTableCell>
                      <DataTableCell className="font-mono">{row.componentPath || '—'}</DataTableCell>
                      <DataTableCell>{row.issue}</DataTableCell>
                    </DataTableRow>
                  ))
                )}
              </DataTableBody>
            </DataTable>
            {missing.length > MISSING_PAGE_SIZE && (
              <TablePagination
                currentPage={safeMissingPage}
                totalPages={missingPageCount}
                totalRecords={missing.length}
                pageSize={MISSING_PAGE_SIZE}
                onPageChange={setMissingPage}
              />
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-accent">Duplicates</h2>
            <p className="text-[11px] text-muted-foreground">
              Shared component keys are listed for review. A shared calculator is not marked failed when the route really loads that component.
            </p>
            <DuplicateBlock title="Duplicate IDs" groups={report.duplicates.ids} />
            <DuplicateBlock title="Duplicate slugs" groups={report.duplicates.slugs} />
            <DuplicateBlock title="Duplicate routes" groups={report.duplicates.routes} />
            <div className="rounded-xl border border-border bg-white p-4 text-xs">
              <h3 className="font-semibold text-foreground">Shared components</h3>
              {report.duplicates.sharedComponents.length === 0 ? (
                <p className="mt-2 text-muted-foreground">No component is used by more than one developed tool.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {report.duplicates.sharedComponents.map((group) => (
                    <li key={group.component}>
                      <span className="font-mono font-semibold">{group.component}</span> · {group.count} tools
                      <span className="mt-1 block text-muted-foreground">{group.slugs.join(', ')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-accent">Audit history</h2>
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeadCell>When</DataTableHeadCell>
                  <DataTableHeadCell>Source</DataTableHeadCell>
                  <DataTableHeadCell>Total</DataTableHeadCell>
                  <DataTableHeadCell>Developed</DataTableHeadCell>
                  <DataTableHeadCell>Pending</DataTableHeadCell>
                  <DataTableHeadCell>Needs Review</DataTableHeadCell>
                  <DataTableHeadCell>New</DataTableHeadCell>
                  <DataTableHeadCell>Regressed</DataTableHeadCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {report.history.length === 0 ? (
                  <DataTableRow>
                    <DataTableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                      No earlier audits.
                    </DataTableCell>
                  </DataTableRow>
                ) : (
                  report.history.map((entry) => (
                    <DataTableRow key={entry.ranAt}>
                      <DataTableCell>{stamp(entry.ranAt)}</DataTableCell>
                      <DataTableCell>{entry.source === 'filesystem' ? 'Live source' : 'Manifest'}</DataTableCell>
                      <DataTableCell>{entry.total.toLocaleString()}</DataTableCell>
                      <DataTableCell>{entry.developed.toLocaleString()}</DataTableCell>
                      <DataTableCell>{entry.notDeveloped.toLocaleString()}</DataTableCell>
                      <DataTableCell>{entry.needsReview.toLocaleString()}</DataTableCell>
                      <DataTableCell>{entry.newlyDeveloped.length}</DataTableCell>
                      <DataTableCell>{entry.regressed.length}</DataTableCell>
                    </DataTableRow>
                  ))
                )}
              </DataTableBody>
            </DataTable>
          </section>
        </>
      )}
    </div>
  );
}

function DuplicateBlock({ title, groups }: { title: string; groups: Array<{ value: string; count: number; slugs: string[] }> }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 text-xs">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {groups.length === 0 ? (
        <p className="mt-2 text-muted-foreground">None found.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {groups.map((group) => (
            <li key={group.value}>
              <span className="font-mono font-semibold">{group.value}</span> · {group.count}
              <span className="mt-1 block text-muted-foreground">{group.slugs.join(', ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
