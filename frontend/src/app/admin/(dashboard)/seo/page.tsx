'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { FormSection } from '@/components/admin/forms/FormSection';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Save, Search, Globe, ShieldCheck } from 'lucide-react';

export default function AdminSeoPage() {
  const [siteTitle, setSiteTitle] = React.useState(
    'Omega Calculators — Every Tool You Need, All in One Place'
  );
  const [titleTemplate, setTitleTemplate] = React.useState('%s | Omega Calculators');
  const [metaDescription, setMetaDescription] = React.useState(
    'Discover powerful, fast, private online tools for everyday productivity, calculations, conversions, PDF editing, and developer workflows.'
  );
  const [canonicalBase, setCanonicalBase] = React.useState('https://megatools.io');
  const [ogImage, setOgImage] = React.useState('/images/og-default-cover.png');
  const [allowIndexing, setAllowIndexing] = React.useState(true);
  const [includeSitemap, setIncludeSitemap] = React.useState(true);

  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMessage(
      'SEO defaults validated successfully in the frontend preview. Next.js metadata configuration and dynamic sitemap generators will be linked to backend settings in the next phase.'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="SEO & Search Appearance"
        description="Configure default meta tags, canonical domains, Open Graph assets, and robots indexing behavior."
      >
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save SEO Settings</span>
        </Button>
      </AdminPageHeader>

      <PendingNotice message="SEO configuration preview only: In this phase, no modifications are made to robots.txt, sitemap.xml, or production metadata tags." />

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Google SERP Live Simulation Card */}
      <Card className="border border-border bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold text-accent">
              Google Search Snippet Preview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 font-sans max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{canonicalBase}</span>
              <span>›</span>
              <span>tools</span>
            </div>
            <h3 className="mt-1.5 text-base font-semibold text-blue-700 hover:underline cursor-pointer truncate">
              {siteTitle}
            </h3>
            <p className="mt-1 text-xs text-secondary-text leading-relaxed line-clamp-2">
              {metaDescription}
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Metadata */}
        <FormSection
          title="Default Site Metadata"
          description="Global fallback tags used across pages that don't declare custom SEO parameters."
        >
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Default Site Title
            </label>
            <Input
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Primary brand title..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Title Template Pattern
              </label>
              <Input
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="%s | Brand Name"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Where %s is replaced by the specific tool or category title.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Canonical Base URL
              </label>
              <Input
                value={canonicalBase}
                onChange={(e) => setCanonicalBase(e.target.value)}
                placeholder="https://yourdomain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Default Meta Description
            </label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Write a clear, enticing summary of your tools platform..."
              rows={3}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Length: {metaDescription.length} characters (Recommended: 140–160).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Default Social Sharing Image (Open Graph)
            </label>
            <Input
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="/images/og-default-cover.png"
            />
          </div>
        </FormSection>

        {/* Crawler & Indexing Directives */}
        <FormSection
          title="Search Crawler & Robots Rules"
          description="Control how Googlebot and Bingbot index platform pages."
          badge={
            <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
              <ShieldCheck className="h-3 w-3" />
              Robots.txt Controls
            </span>
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-accent">Global Search Indexing</div>
              <div className="text-[11px] text-muted-foreground">
                When enabled, outputs &ldquo;index, follow&rdquo;. Turn off during pre-launch
                staging.
              </div>
            </div>
            <Switch checked={allowIndexing} onCheckedChange={setAllowIndexing} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <div className="text-xs font-semibold text-accent">
                Auto-Generate Dynamic Sitemap.xml
              </div>
              <div className="text-[11px] text-muted-foreground">
                Automatically indexes all published categories and verified tools.
              </div>
            </div>
            <Switch checked={includeSitemap} onCheckedChange={setIncludeSitemap} />
          </div>

          <div className="mt-4 rounded-lg bg-background p-3 border border-border">
            <span className="text-[11px] font-mono text-muted-foreground block mb-1">
              Simulated Robots.txt Header:
            </span>
            <pre className="text-[11px] font-mono text-accent leading-relaxed">
              {`User-agent: *\nDisallow: /admin/\nDisallow: /api/\nAllow: /\nSitemap: ${canonicalBase}/sitemap.xml`}
            </pre>
          </div>
        </FormSection>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            type="submit"
            size="sm"
            className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save SEO Defaults</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
