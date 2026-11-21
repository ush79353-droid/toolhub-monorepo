export const CONTACT_SUBJECTS = [
  { value: 'general', label: 'General', mailSubject: 'General question' },
  { value: 'mistake', label: 'Report a mistake', mailSubject: 'Error report:' },
  { value: 'suggestion', label: 'Suggest a tool', mailSubject: 'Tool suggestion' },
  { value: 'business', label: 'Business', mailSubject: 'Business enquiry' },
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number]['value'];

export type ContactDraft = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactDraft): Partial<Record<keyof ContactDraft, string>> {
  const errors: Partial<Record<keyof ContactDraft, string>> = {};
  if (!values.name.trim()) errors.name = 'Add your name.';
  if (!values.email.trim()) errors.email = 'Add your email address.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'That email address does not look complete.';
  if (!CONTACT_SUBJECTS.some((item) => item.value === values.subject)) errors.subject = 'Choose a subject.';
  if (values.message.trim().length < 10) errors.message = 'Write at least a short sentence.';
  return errors;
}

export function contactDestination(subject: string, general: string, business: string): string {
  const generalEmail = general.trim();
  const businessEmail = business.trim();
  if (subject === 'business') return businessEmail || generalEmail;
  return generalEmail;
}

export function contactMailto(input: {
  to: string;
  name: string;
  replyTo: string;
  subjectLabel: string;
  message: string;
}): string {
  const body = `Name: ${input.name.trim()}\nEmail: ${input.replyTo.trim()}\n\n${input.message.trim()}`;
  return `mailto:${input.to}?subject=${encodeURIComponent(input.subjectLabel)}&body=${encodeURIComponent(body)}`;
}

function selfCheck(): void {
  const empty = validateContact({ name: '', email: 'not-an-email', subject: '', message: 'short' });
  if (!empty.name || !empty.email || !empty.subject || !empty.message) throw new Error('contact validation');
  const ok = validateContact({
    name: 'Ada',
    email: 'ada@example.com',
    subject: 'mistake',
    message: 'The result was 4, I expected 5.',
  });
  if (Object.keys(ok).length !== 0) throw new Error('contact validation pass');
  if (contactDestination('business', 'a@b.co', 'press@b.co') !== 'press@b.co') throw new Error('contact business');
  if (contactDestination('general', 'a@b.co', 'press@b.co') !== 'a@b.co') throw new Error('contact general');
  if (contactDestination('business', 'a@b.co', '') !== 'a@b.co') throw new Error('contact business fallback');
  const href = contactMailto({
    to: 'a@b.co',
    name: 'Ada',
    replyTo: 'ada@example.com',
    subjectLabel: 'Error report:',
    message: 'Expected 5.',
  });
  if (!href.startsWith('mailto:a@b.co?subject=Error%20report%3A&body=')) throw new Error('contact mailto');
}

const entry = typeof process !== 'undefined' ? process.argv[1] : '';
if (entry && entry.replace(/\\/g, '/').endsWith('src/components/contact/contact-message.ts')) {
  selfCheck();
}
