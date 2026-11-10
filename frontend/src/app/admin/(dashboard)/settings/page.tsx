'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { FormSection } from '@/components/admin/forms/FormSection';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Sliders,
  Globe,
  Palette,
  Search,
  Shield,
  Bell,
  Wrench,
  Save,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  // General Settings State
  const [siteName, setSiteName] = React.useState('Mega Tools');
  const [siteDesc, setSiteDesc] = React.useState('Scalable Online Multi-Tool Platform');
  const [siteUrl, setSiteUrl] = React.useState('https://megatools.io');
  const [timezone, setTimezone] = React.useState('UTC');
  const [language, setLanguage] = React.useState('en');

  // Maintenance & Security
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);

  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const tabs = [
    { id: 'general', label: 'General', icon: <Sliders className="h-4 w-4" /> },
    { id: 'website', label: 'Website & Contact', icon: <Globe className="h-4 w-4" /> },
    { id: 'appearance', label: 'Brand & Palette', icon: <Palette className="h-4 w-4" /> },
    { id: 'seo', label: 'SEO Defaults', icon: <Search className="h-4 w-4" /> },
    { id: 'security', label: 'Security & Limits', icon: <Shield className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="h-4 w-4" /> },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMessage(
      'System configuration validated in the frontend preview. Persistent storage in MongoDB and Redis will be connected during backend integration.'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="System Settings"
        description="Global platform parameters, brand identity enforcement, security policies, and maintenance toggles."
      >
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save All Settings</span>
        </Button>
      </AdminPageHeader>

      <PendingNotice message="System settings preview mode: Theme tokens are locked to the Mega Tools brand architecture and configuration mutations are not yet committed to MongoDB." />

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <FormSection
            title="General Platform Configuration"
            description="Core identifiers, default localization, and primary platform domains."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Platform Name
                </label>
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Primary URL
                </label>
                <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Tagline / Short Description
              </label>
              <Textarea value={siteDesc} onChange={(e) => setSiteDesc(e.target.value)} rows={2} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Default Timezone
                </label>
                <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="EST">America/New_York (EST)</option>
                  <option value="PST">America/Los_Angeles (PST)</option>
                  <option value="PKT">Asia/Karachi (PKT)</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Default UI Language
                </label>
                <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English (US)</option>
                  <option value="es">Español (Coming Soon)</option>
                  <option value="de">Deutsch (Coming Soon)</option>
                </Select>
              </div>
            </div>
          </FormSection>
        </div>
      )}

      {/* Tab 2: Website */}
      {activeTab === 'website' && (
        <div className="space-y-6">
          <FormSection
            title="Website & Support Info"
            description="Public contact details, support routing, and footer copyright data."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Support Email
                </label>
                <Input defaultValue="support@megatools.io" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Legal / DMCA Contact
                </label>
                <Input defaultValue="legal@megatools.io" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Footer Copyright Line
              </label>
              <Input defaultValue="© 2026 Mega Tools Inc. All rights reserved." />
            </div>
          </FormSection>
        </div>
      )}

      {/* Tab 3: Appearance (LOCKED PALETTE ENFORCEMENT) */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <FormSection
            title="Locked Brand Identity & Palette Safeguard"
            description="The Mega Tools color system is strictly locked to maintain SaaS aesthetic consistency."
            badge={
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                <Check className="h-3 w-3" />
                Palette Locked
              </span>
            }
          >
            <div className="rounded-lg border border-teal-200 bg-secondary/30 p-3 text-xs text-primary leading-relaxed">
              <strong>Architectural Rule:</strong> Theme mutations that conflict with the approved
              Mega Tools brand system are prohibited. The palette below is enforced consistently
              across all public and admin views.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { name: 'Primary Teal', hex: '#087E8B', desc: 'Main interactive color' },
                {
                  name: 'Light Mint (Secondary)',
                  hex: '#D9F0EF',
                  desc: 'Highlight tags & active states',
                },
                { name: 'Dark Accent', hex: '#163C43', desc: 'Headings & brand mark' },
                { name: 'Primary Hover', hex: '#066773', desc: 'Button hover transition' },
                { name: 'Soft Teal', hex: '#EAF7F6', desc: 'Card backdrop tint' },
                { name: 'Canvas Background', hex: '#F7F8F6', desc: 'Universal base background' },
                { name: 'Primary Text', hex: '#202B2D', desc: 'High contrast readable body' },
                { name: 'Secondary Text', hex: '#667477', desc: 'Subtitles & timestamps' },
                { name: 'Border Tone', hex: '#DCE6E5', desc: 'Clean structural divider' },
              ].map((color) => (
                <div
                  key={color.hex}
                  className="rounded-lg border border-border p-2.5 bg-white space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-6 w-6 rounded-md border border-black/10 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-accent truncate">{color.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{color.hex}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{color.desc}</div>
                </div>
              ))}
            </div>
          </FormSection>
        </div>
      )}

      {/* Tab 4: SEO Defaults */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <FormSection
            title="SEO & Indexing Presets"
            description="Global search indexing policy and social open graph fallbacks."
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Global Open Graph Image
                </label>
                <Input defaultValue="/images/og-default-cover.png" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent mb-1.5">
                  Twitter / X Card Type
                </label>
                <Select defaultValue="summary_large_image">
                  <option value="summary_large_image">summary_large_image (Recommended)</option>
                  <option value="summary">summary</option>
                </Select>
              </div>
            </div>
          </FormSection>
        </div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <FormSection
            title="Security & Rate Limiting Safeguards"
            description="Configure edge protections, brute-force defenses, and request throttles."
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-accent">API Rate Limiting</div>
                <div className="text-[11px] text-muted-foreground">
                  Throttle excessive requests to 100 req/min per IP.
                </div>
              </div>
              <Switch checked={rateLimitEnabled} onCheckedChange={setRateLimitEnabled} />
            </div>

            <div className="pt-3 border-t border-border">
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Allowed CORS Origins
              </label>
              <Input
                defaultValue="https://megatools.io, http://localhost:3000"
                className="font-mono text-xs"
              />
            </div>
          </FormSection>
        </div>
      )}

      {/* Tab 6: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <FormSection
            title="Notification & Alert Routing"
            description="Dispatch notifications for high error rates or critical security events."
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-accent">Security Alert Emails</div>
                <div className="text-[11px] text-muted-foreground">
                  Receive instant alerts for repeated failed login attempts.
                </div>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </FormSection>
        </div>
      )}

      {/* Tab 7: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <FormSection
            title="Maintenance & System Operations"
            description="Temporarily take public routes offline or purge platform asset caches."
            badge={
              maintenanceMode ? (
                <span className="rounded bg-rose-100 text-rose-700 px-2 py-0.5 text-xs font-bold">
                  Maintenance Active
                </span>
              ) : undefined
            }
          >
            <div className="flex items-center justify-between p-3 rounded-lg border border-rose-200 bg-rose-50/50">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-900">Platform Maintenance Mode</div>
                  <div className="text-[11px] text-rose-700">
                    When active, public visitors are shown a 503 Maintenance page. Admin console
                    remains accessible.
                  </div>
                </div>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-accent">
                  Purge In-Memory & Edge Caches
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Clears cached ISR pages and Next.js route caches.
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNoticeMessage('Cache purge signal dispatched to edge CDN.')}
                className="text-xs"
              >
                Purge All Caches
              </Button>
            </div>
          </FormSection>
        </div>
      )}
    </div>
  );
}
