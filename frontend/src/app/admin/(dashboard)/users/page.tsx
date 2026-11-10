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
import { UserPlus, Shield, Eye, X } from 'lucide-react';
import { INITIAL_ADMIN_USERS, type AdminUser } from '@/lib/admin-mock-data';

export default function AdminUsersPage() {
  const [users] = React.useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  // Selected user for drawer
  const [drawerUser, setDrawerUser] = React.useState<AdminUser | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleInviteUser = () => {
    setNoticeMessage(
      'User invitation dialog simulated. Account creation with email verification will be connected to the Express authentication service.'
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Staff & Users"
        description="Manage administrator access privileges, roles, and console session security."
      >
        <Button
          type="button"
          size="sm"
          onClick={handleInviteUser}
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Invite Administrator</span>
        </Button>
      </AdminPageHeader>

      <PendingNotice message="User directory displays fictional sample records for UI/UX demonstration. In this phase, no real personal data is handled and backend RBAC authentication is pending." />

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
        searchPlaceholder="Search by name or email..."
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        statusOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Pending', value: 'pending' },
          { label: 'Suspended', value: 'suspended' },
        ]}
        extraFilters={
          <div className="w-full sm:w-40">
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 text-xs"
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </Select>
          </div>
        }
        hasActiveFilters={Boolean(searchQuery || roleFilter || statusFilter)}
        onReset={() => {
          setSearchQuery('');
          setRoleFilter('');
          setStatusFilter('');
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try broadening your search query or reset the role filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setRoleFilter('');
            setStatusFilter('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-2">
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeadCell>User</DataTableHeadCell>
                <DataTableHeadCell>Email Address</DataTableHeadCell>
                <DataTableHeadCell>Role</DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
                <DataTableHeadCell>Joined Date</DataTableHeadCell>
                <DataTableHeadCell>Last Activity</DataTableHeadCell>
                <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {paginated.map((user) => (
                <DataTableRow key={user.id}>
                  <DataTableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-bold text-xs text-primary">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-accent">{user.name}</span>
                    </div>
                  </DataTableCell>
                  <DataTableCell className="font-mono text-muted-foreground text-[11px]">
                    {user.email}
                  </DataTableCell>
                  <DataTableCell>
                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-semibold text-accent">
                      <Shield className="h-3 w-3 text-primary" />
                      {user.role}
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={user.status} />
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground text-[11px]">
                    {user.joinedDate}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground text-[11px]">
                    {user.lastActivity}
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => setDrawerUser(user)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      title="Inspect user details"
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

      {/* User Detail Drawer / Modal */}
      {drawerUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setDrawerUser(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white text-sm">
                  {drawerUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-accent text-base leading-tight">
                    {drawerUser.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">{drawerUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerUser(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-border text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-accent">{drawerUser.id}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-muted-foreground">Permission Role</span>
                <span className="font-semibold text-accent">{drawerUser.role}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-muted-foreground">Account Status</span>
                <StatusBadge status={drawerUser.status} />
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Joined Date</span>
                <span className="text-accent">{drawerUser.joinedDate}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-muted-foreground">Last Recorded Activity</span>
                <span className="text-accent">{drawerUser.lastActivity}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDrawerUser(null)}
                className="text-xs"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
