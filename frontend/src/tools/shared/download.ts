/**
 * Trigger a browser file download from an in-memory text payload.
 * Delays blob URL revocation so Chromium/Safari do not cancel the download.
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = 'text/csv;charset=utf-8;'
): void {
  if (typeof document === 'undefined') return;

  const safeName = filename.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').trim() || 'download.txt';
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeName;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
