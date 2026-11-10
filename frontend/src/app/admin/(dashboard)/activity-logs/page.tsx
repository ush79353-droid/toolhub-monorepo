'use client';

import * as React from 'react';
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
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { EmptyState } from '@/components/admin/shared/EmptyState';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Eye, X } from 'lucide-react';
import { INITIAL_ADMIN_LOGS, type AdminActivityLog } from '@/lib/admin-mock-data';

export default function AdminActivityLogsPage() {
  const [logs] = React.useState<AdminActivityLog[]>(INITIAL_ADMIN_LOGS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState('');
  const [resultFilter, setResultFilter] = React.useState('');
  const [selectedLog, setSelectedLog] = React.useState<AdminActivityLog | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  const filtered = React.useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = !actionFilter || log.action === actionFilter;
      const matchesResult = !resultFilter || log.result === resultFilter;
      return matchesSearch && matchesAction && matchesResult;
    });
  }, [logs, searchQuery, actionFilter, resultFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit & Activity Logs"
        description="Chronological audit records of administrative operations, registry mutations, and configuration updates."
      />

      <PendingNotice message="Audit logs interface displays simulated security events for UI prototyping. Production event streaming will write to MongoDB capped audit collections." />

      {/* Filters */}
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search logs by actor, resource, or details..."
        statusFilter={resultFilter}
        onStatusChange={(r) => {
          setResultFilter(r);
          setCurrentPage(1);
        }}
        statusOptions={[
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
        ]}
        extraFilters={
          <div className="w-full sm:w-44">
            <Select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 text-xs"
            >
              <option value="">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="PUBLISH">PUBLISH</option>
              <option value="CONFIG_CHANGE">CONFIG_CHANGE</option>
              <option value="LOGIN_ATTEMPT">LOGIN_ATTEMPT</option>
            </Select>
          </div>
        }
        hasActiveFilters={Boolean(searchQuery || actionFilter || resultFilter)}
        onReset={() => {
          setSearchQuery('');
          setActionFilter('');
          setResultFilter('');
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No logs found"
          description="Try broadening your search query or reset the filter dropdowns."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setActionFilter('');
            setResultFilter('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-2">
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeadCell>Timestamp</DataTableHeadCell>
                <DataTableHeadCell>Actor</DataTableHeadCell>
                <DataTableHeadCell>Action</DataTableHeadCell>
                <DataTableHeadCell>Target Resource</DataTableHeadCell>
                <DataTableHeadCell>Result</DataTableHeadCell>
                <DataTableHeadCell>Event Details</DataTableHeadCell>
                <DataTableHeadCell className="text-right">Inspect</DataTableHeadCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {paginated.map((log) => (
                <DataTableRow key={log.id}>
                  <DataTableCell className="font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </DataTableCell>
                  <DataTableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                        {log.actor.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-accent text-xs leading-none">
                          {log.actor.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {log.actor.role}
                        </div>
                      </div>
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                    <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded font-bold text-accent">
                      {log.action}
                    </span>
                  </DataTableCell>
                  <DataTableCell className="font-mono text-primary text-[11px]">
                    {log.resource}
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={log.result} />
                  </DataTableCell>
                  <DataTableCell className="max-w-xs truncate text-muted-foreground text-[11px]">
                    {log.details}
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      title="Inspect event details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
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

      {/* Log Inspection Drawer */}
      {selectedLog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-accent text-base">Audit Log Event</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  ID: {selectedLog.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-border text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-mono text-accent">{selectedLog.timestamp}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Actor</span>
                <span className="text-accent font-semibold">
                  {selectedLog.actor.name} ({selectedLog.actor.email})
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-muted-foreground">Action Type</span>
                <span className="font-mono bg-muted px-2 py-0.5 rounded font-bold">
                  {selectedLog.action}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Resource Path</span>
                <span className="font-mono text-primary font-semibold">{selectedLog.resource}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-muted-foreground">Result</span>
                <StatusBadge status={selectedLog.result} />
              </div>
              <div className="py-2 space-y-1">
                <span className="text-muted-foreground block">Event Payload / Details</span>
                <p className="rounded-lg bg-background p-3 text-xs text-accent leading-relaxed border border-border">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close Audit Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
