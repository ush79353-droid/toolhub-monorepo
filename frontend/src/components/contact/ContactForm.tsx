'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CONTACT_SUBJECTS,
  contactDestination,
  contactMailto,
  validateContact,
  type ContactDraft,
} from './contact-message';

const empty: ContactDraft = { name: '', email: '', subject: '', message: '' };

function fieldClass(invalid: boolean): string {
  return invalid ? 'h-11 border-rose-500' : 'h-11';
}

export function ContactForm({ email, businessEmail }: { email: string; businessEmail: string }) {
  const [values, setValues] = React.useState<ContactDraft>(empty);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactDraft, string>>>({});
  const [notice, setNotice] = React.useState<string | null>(null);
  const noticeRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);

  function update(field: keyof ContactDraft, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validateContact(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = (Object.keys(next) as (keyof ContactDraft)[])[0];
      document.getElementById(`contact-${first}`)?.focus();
      setNotice(null);
      return;
    }
    const subject = CONTACT_SUBJECTS.find((item) => item.value === values.subject);
    const to = subject ? contactDestination(subject.value, email, businessEmail) : '';
    if (!subject || !to) {
      setNotice('There is no public email address on this page yet, so this message was not sent.');
      return;
    }
    window.location.href = contactMailto({
      to,
      name: values.name,
      replyTo: values.email,
      subjectLabel: subject.mailSubject,
      message: values.message,
    });
    setNotice('Your email app should open with this message. Send it there to finish.');
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-accent">Send a message</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The form opens your email app with the note filled in. We do not keep a copy on this site.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-accent">
            Name
          </label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name ? (
            <p id="contact-name-error" className="mt-1.5 text-sm text-rose-600">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-accent">
            Email
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={fieldClass(Boolean(errors.email))}
          />
          {errors.email ? (
            <p id="contact-email-error" className="mt-1.5 text-sm text-rose-600">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-accent">
            Subject
          </label>
          <Select
            id="contact-subject"
            name="subject"
            value={values.subject}
            onChange={(event) => update('subject', event.target.value)}
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            className={fieldClass(Boolean(errors.subject))}
          >
            <option value="">Choose a subject</option>
            {CONTACT_SUBJECTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          {errors.subject ? (
            <p id="contact-subject-error" className="mt-1.5 text-sm text-rose-600">
              {errors.subject}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-accent">
            Message
          </label>
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`min-h-32 ${errors.message ? 'border-rose-500' : ''}`}
          />
          {errors.message ? (
            <p id="contact-message-error" className="mt-1.5 text-sm text-rose-600">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>
      <Button type="submit" className="mt-6 h-11 bg-primary px-8 text-white hover:bg-primary-hover">
        Send message
      </Button>
      {notice ? (
        <p ref={noticeRef} tabIndex={-1} role="status" className="mt-4 text-sm leading-relaxed text-accent outline-none">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
