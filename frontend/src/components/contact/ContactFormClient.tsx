'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const subjects = [
  'General inquiry',
  'Feature request',
  'Bug report',
  'Partnership',
  'Other',
] as const;

type Field = 'name' | 'email' | 'subject' | 'message';
type Status = 'idle' | 'checking' | 'preview';

const empty = { name: '', email: '', subject: '', message: '' };

function validate(values: typeof empty) {
  const next: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) next.name = 'Add your name.';
  if (!values.email.trim()) {
    next.email = 'Add your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    next.email = 'That email address does not look complete.';
  }
  if (!values.subject) next.subject = 'Choose a subject.';
  if (values.message.trim().length < 10) {
    next.message = 'Write at least a short sentence, 10 characters or more.';
  }
  return next;
}

export function ContactFormClient() {
  const [values, setValues] = React.useState(empty);
  const [errors, setErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = React.useState<Status>('idle');
  const resultRef = React.useRef<HTMLHeadingElement>(null);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (status === 'preview') resultRef.current?.focus();
  }, [status]);

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function update(field: Field, value: string) {
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
    if (status === 'checking') return;
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = (Object.keys(next) as Field[])[0];
      document.getElementById(first)?.focus();
      return;
    }
    setStatus('checking');
    timer.current = window.setTimeout(() => setStatus('preview'), 400);
  }

  function reset() {
    if (timer.current) window.clearTimeout(timer.current);
    setValues(empty);
    setErrors({});
    setStatus('idle');
  }

  if (status === 'preview') {
    return (
      <div className="border border-border border-l-4 border-l-primary bg-white px-5 py-8 sm:px-8">
        <h2
          ref={resultRef}
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-accent outline-none"
        >
          The form checks out. It was not sent.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {values.name.trim()}, this note stayed in your browser. There is no inbox on the other side yet, so nothing was delivered.
        </p>
        <Button type="button" variant="outline" className="mt-6" onClick={reset}>
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-border border-l-4 border-l-primary bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 className="text-2xl font-semibold tracking-tight text-accent">Write a message</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        The page checks these fields here. It does not send the message. Delivery is not connected yet.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Full name"
          error={errors.name}
        >
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            disabled={status === 'checking'}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="Your name"
            className={errors.name ? 'h-11 border-red-400' : 'h-11'}
            onChange={(event) => update('name', event.target.value)}
          />
        </Field>
        <Field id="email" label="Email address" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            disabled={status === 'checking'}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="you@email.com"
            className={errors.email ? 'h-11 border-red-400' : 'h-11'}
            onChange={(event) => update('email', event.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field id="subject" label="Subject" error={errors.subject}>
          <Select
            id="subject"
            name="subject"
            value={values.subject}
            disabled={status === 'checking'}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            className={errors.subject ? 'h-11 border-red-400' : 'h-11'}
            onChange={(event) => update('subject', event.target.value)}
          >
            <option value="">Choose a subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="message" label="Message" error={errors.message}>
          <Textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            disabled={status === 'checking'}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="What should we look at?"
            className={errors.message ? 'min-h-36 border-red-400' : 'min-h-36'}
            onChange={(event) => update('message', event.target.value)}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          size="lg"
          disabled={status === 'checking'}
          className="w-full bg-primary text-white hover:bg-primary-hover sm:w-auto"
        >
          {status === 'checking' ? 'Checking' : 'Check message'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-accent">
        {label}{' '}
        <abbr title="required" className="text-primary no-underline">
          *
        </abbr>
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
