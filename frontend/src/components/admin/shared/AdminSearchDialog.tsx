'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Layers,
  Wrench,
  Users,
  Settings,
  Activity,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { INITIAL_ADMIN_TOOLS, INITIAL_ADMIN_CATEGORIES } from '@/lib/admin-mock-data';

interface AdminSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSearchDialog({ isOpen, onClose }: AdminSearchDialogProps) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = INITIAL_ADMIN_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.slug.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredCategories = INITIAL_ADMIN_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const quickNav = [
    { label: 'Tools Directory', href: '/admin/tools', icon: Wrench },
    { label: 'Category Management', href: '/admin/categories', icon: Layers },
    { label: 'User Accounts', href: '/admin/users', icon: Users },
    { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
    { label: 'CMS Pages', href: '/admin/pages', icon: FileText },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-white shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, categories, pages, settings (Esc to exit)..."
            className="flex-1 bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {quickNav.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Navigation
              </div>
              <div className="space-y-0.5">
                {quickNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {filteredTools.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Tools
              </div>
              <div className="space-y-0.5">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/admin/tools/${tool.id}/edit`}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-semibold text-accent">{tool.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          /{tool.slug}
                        </div>
                      </div>
                    </div>
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground capitalize">
                      {tool.categoryName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredCategories.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Categories
              </div>
              <div className="space-y-0.5">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/admin/categories/${cat.id}/edit`}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{cat.toolCount} tools</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {quickNav.length === 0 &&
            filteredTools.length === 0 &&
            filteredCategories.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No matching tools, categories, or settings found for &ldquo;{query}&rdquo;.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
