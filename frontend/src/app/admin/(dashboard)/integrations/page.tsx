'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plug, ShieldCheck, Settings, X, Lock, Save } from 'lucide-react';
import { INITIAL_ADMIN_INTEGRATIONS, type AdminIntegration } from '@/lib/admin-mock-data';

export default function AdminIntegrationsPage() {
  const [integrations] = React.useState<AdminIntegration[]>(INITIAL_ADMIN_INTEGRATIONS);
  const [activeConfig, setActiveConfig] = React.useState<AdminIntegration | null>(null);
  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeConfig) {
      setNoticeMessage(
        `Configuration for '${activeConfig.name}' validated. Secure secrets storage in backend environment variables and AWS Secrets Manager will be implemented during API deployment.`
      );
      setActiveConfig(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Third-Party Integrations"
        description="Connect and monitor external AI gateways, file storage buckets, email systems, and telemetry."
      />

      <PendingNotice message="Security Boundary: In this UI phase, no real API secrets are stored or transmitted. All third-party communication occurs strictly through the Express backend in production." />

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-xs hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Plug className="h-5 w-5" />
                </div>
                <StatusBadge status={item.status} />
              </div>

              <h3 className="mt-4 font-bold text-accent text-sm">{item.name}</h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {item.category}
              </span>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-5 border-t border-border pt-3 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/70">
                {item.lastSync ? `Synced: ${item.lastSync}` : 'Not connected'}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveConfig(item)}
                className="h-8 text-xs inline-flex items-center gap-1.5"
              >
                <Settings className="h-3 w-3" />
                <span>Configure</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {activeConfig && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveConfig(null)}
        >
          <form
            onSubmit={handleSaveConfig}
            className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Plug className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-accent text-sm">Configure {activeConfig.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{activeConfig.category}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveConfig(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-teal-200 bg-secondary/30 p-3 text-xs text-primary flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Encrypted Credential Storage:</strong> Production API keys are stored solely
                on the Express server with AES-256-GCM encryption. Never exposed to browser
                components.
              </span>
            </div>

            <div className="space-y-3">
              {activeConfig.configFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-accent mb-1 flex items-center justify-between">
                    <span>{field.label}</span>
                    {field.isSecret && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Secret
                      </span>
                    )}
                  </label>
                  <Input
                    defaultValue={field.maskedValue}
                    type={field.isSecret ? 'password' : 'text'}
                    className="text-xs font-mono"
                    readOnly
                  />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveConfig(null)}
              >
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Credentials</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
