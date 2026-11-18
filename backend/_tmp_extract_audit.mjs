import fs from 'node:fs';

const path =
  'C:/Users/bilal/.cursor/projects/d-Project-ToolHub/agent-transcripts/290d1a02-bcc2-44f8-9f21-6786927ff2bf/290d1a02-bcc2-44f8-9f21-6786927ff2bf.jsonl';
const lines = fs.readFileSync(path, 'utf8').split(/\n/);
for (const line of lines) {
  if (!line.trim()) continue;
  const o = JSON.parse(line);
  if (o.role !== 'assistant') continue;
  const content = o.message?.content;
  const text = Array.isArray(content)
    ? content
        .filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('\n')
    : content || '';
  if (text.includes('Full audit table') && text.includes('Car Interest Calculator')) {
    const start = text.indexOf('| # | Calculator |');
    const end = text.indexOf('\n\n###', start);
    const table = text.slice(start, end > 0 ? end : start + 30000);
    fs.writeFileSync('_tmp_audit_table.md', table);
    console.log('wrote', table.split('\n').length, 'lines');
    // also extract slug/component/status rows
    const rows = [];
    for (const row of table.split('\n')) {
      if (!row.startsWith('|') || row.includes('Calculator | Slug')) continue;
      if (row.includes('---|')) continue;
      const cols = row.split('|').map((c) => c.trim());
      // | # | name | slug | component | ... | status |
      if (cols.length < 8) continue;
      rows.push({
        n: cols[1],
        name: cols[2],
        slug: cols[3].replace(/`/g, ''),
        key: cols[4].replace(/`/g, ''),
        status: cols[7],
        issues: cols[8],
      });
    }
    fs.writeFileSync('_tmp_audit_rows.json', JSON.stringify(rows, null, 2));
    console.log('rows', rows.length);
    console.log(
      'statuses',
      rows.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {}),
    );
    break;
  }
}
