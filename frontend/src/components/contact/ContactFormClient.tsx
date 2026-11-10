'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, CheckCircle2, Info } from 'lucide-react';

export function ContactFormClient() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Please enter a subject.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // UI Preview simulation - honest feedback without claiming remote delivery
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-xs">
      {/* Honest Notice */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-muted/60 p-4 text-xs text-muted-foreground">
        <Info className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
        <div>
          <strong className="text-accent">Contact Form UI Preview:</strong> This interactive form
          validates inputs on the client side. Live email delivery will be wired to the Express
          backend in an upcoming phase.
        </div>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-10 text-center animate-in fade-in duration-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-accent">Form Validation Successful</h3>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            Thank you, <strong>{formData.name}</strong>. Your message preview passed client
            validation. In production, inquiries will route to our support gateway.
          </p>
          <Button onClick={handleReset} variant="outline" size="sm" className="mt-6">
            Send Another Note
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-wider text-accent"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-accent"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@example.com"
                className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-bold uppercase tracking-wider text-accent"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Tool suggestion, bug report, or feedback"
              className={errors.subject ? 'border-red-400 focus-visible:ring-red-400' : ''}
            />
            {errors.subject && <p className="text-xs text-red-600">{errors.subject}</p>}
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="message"
              className="text-xs font-bold uppercase tracking-wider text-accent"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what tool you would like to see, or report an issue..."
              className={`w-full rounded-lg border border-border bg-white p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.message ? 'border-red-400 focus:ring-red-300' : ''
              }`}
            />
            {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 bg-primary text-white hover:bg-[hsl(var(--primary-hover))] sm:w-auto"
            >
              <Send className="h-4 w-4" />
              <span>Submit Feedback</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
