import { isIndexingNoticeType, notifyGoogleIndex } from '../modules/seo/google-indexing';

/**
 * One-off Indexing API notify. Does nothing until GOOGLE_INDEXING_ENABLED=true.
 * Usage: npm run indexing:notify -- <https://public-url> [URL_UPDATED|URL_DELETED]
 */
async function main(): Promise<void> {
  const url = process.argv[2]?.trim() ?? '';
  const typeArg = process.argv[3]?.trim() || 'URL_UPDATED';
  if (!url || !isIndexingNoticeType(typeArg)) {
    console.error(
      'Usage: npm run indexing:notify -- <https://public-url> [URL_UPDATED|URL_DELETED]'
    );
    process.exit(1);
  }

  const result = await notifyGoogleIndex(url, typeArg);
  if (!result.sent) {
    const hint =
      result.reason === 'disabled'
        ? 'Set GOOGLE_INDEXING_ENABLED=true in backend/.env, then run this again.'
        : 'Set GOOGLE_INDEXING_KEY_FILE to the service-account JSON path.';
    console.error(`Not sent (${result.reason}). ${hint}`);
    process.exit(1);
  }
  console.log(`Sent ${result.type} for ${result.url}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
