import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  assertIndexableUrl,
  sendIndexingNotice,
  toolIndexUrl,
  type IndexingNotice,
} from './google-indexing';

test('tool index url is the public tools path', () => {
  assert.equal(
    toolIndexUrl('loan-calculator', 'https://omegacalculators.com'),
    'https://omegacalculators.com/tools/loan-calculator'
  );
  assert.equal(
    toolIndexUrl('/loan-calculator', 'https://omegacalculators.com/'),
    'https://omegacalculators.com/tools/loan-calculator'
  );
});

test('indexable urls must be public https', () => {
  assert.equal(assertIndexableUrl(' https://example.com/tools/a '), 'https://example.com/tools/a');
  assert.throws(() => assertIndexableUrl('http://example.com/tools/a'), /https/);
  assert.throws(() => assertIndexableUrl('https://localhost/tools/a'), /public host/);
  assert.throws(() => assertIndexableUrl('/tools/a'), /absolute https/);
});

test('disabled indexing does not call Google', async () => {
  let calls = 0;
  const result = await sendIndexingNotice(
    { url: 'https://example.com/tools/a', type: 'URL_UPDATED' },
    {
      enabled: false,
      keyFile: 'missing.json',
      request: async () => {
        calls += 1;
      },
    }
  );
  assert.deepEqual(result, { sent: false, reason: 'disabled' });
  assert.equal(calls, 0);
});

test('missing key does not call Google', async () => {
  const result = await sendIndexingNotice(
    { url: 'https://example.com/tools/a', type: 'URL_DELETED' },
    {
      enabled: true,
      keyFile: '   ',
      request: async () => {
        throw new Error('should not send');
      },
    }
  );
  assert.deepEqual(result, { sent: false, reason: 'missing_key' });
});

test('enabled indexing posts the notice with the key path', async () => {
  const keyFile = path.join(os.tmpdir(), `indexing-key-${process.pid}.json`);
  fs.writeFileSync(keyFile, '{}');
  const seen: { keyFile: string; notice: IndexingNotice }[] = [];
  try {
    const result = await sendIndexingNotice(
      { url: 'https://example.com/tools/a', type: 'URL_UPDATED' },
      {
        enabled: true,
        keyFile,
        request: async (resolved, notice) => {
          seen.push({ keyFile: resolved, notice });
        },
      }
    );
    assert.deepEqual(result, {
      sent: true,
      url: 'https://example.com/tools/a',
      type: 'URL_UPDATED',
    });
    assert.equal(seen.length, 1);
    assert.equal(seen[0]?.keyFile, keyFile);
    assert.deepEqual(seen[0]?.notice, {
      url: 'https://example.com/tools/a',
      type: 'URL_UPDATED',
    });
  } finally {
    fs.unlinkSync(keyFile);
  }
});
