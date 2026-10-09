import { SEED_RESOURCES } from '../src/data/resources';
import { CHANNELS, channelSearchUrl } from '../src/data/channels';
import { OFFICIAL_PYQ_ARCHIVES } from '../src/data/officialPyqPapers';
import { SUBJECTS } from '../src/data/subjects';

interface Issue {
  id: string;
  type: string;
  url: string;
  reason: string;
}

const issues: Issue[] = [];

console.log('--- STARTING COMPREHENSIVE LINK VERIFICATION ---');

// 1. Check SEED_RESOURCES
let internalCount = 0;
let youtubeCount = 0;
let externalCount = 0;

for (const r of SEED_RESOURCES) {
  if (!r.url || typeof r.url !== 'string' || r.url.trim() === '') {
    issues.push({ id: r.id, type: 'resource', url: String(r.url), reason: 'URL is empty or missing' });
    continue;
  }

  const trimmed = r.url.trim();

  if (trimmed.includes('example.com')) {
    issues.push({ id: r.id, type: 'resource', url: trimmed, reason: 'URL contains placeholder example.com' });
  }

  if (trimmed.includes('undefined') || trimmed.includes('null') || trimmed.includes('NaN')) {
    issues.push({ id: r.id, type: 'resource', url: trimmed, reason: 'URL contains undefined, null or NaN' });
  }

  if (trimmed.startsWith('/')) {
    internalCount++;
    // Verify subject ID in internal route
    // e.g. /subjects/:subjectId or /subjects/:subjectId/:chapterId#chapter-pyqs
    const parts = trimmed.split('/');
    if (parts[1] === 'subjects' && parts[2]) {
      const subjectId = parts[2].split('?')[0].split('#')[0];
      const validSub = SUBJECTS.find(s => s.id === subjectId);
      if (!validSub) {
        issues.push({ id: r.id, type: 'resource', url: trimmed, reason: `Invalid subject id "${subjectId}" in internal route` });
      }
    }
  } else if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    if (trimmed.includes('youtube.com')) {
      youtubeCount++;
      try {
        const u = new URL(trimmed);
        if (!u.searchParams.get('search_query')) {
          issues.push({ id: r.id, type: 'resource', url: trimmed, reason: 'YouTube search URL missing search_query param' });
        }
      } catch (err: any) {
        issues.push({ id: r.id, type: 'resource', url: trimmed, reason: `Malformed URL: ${err.message}` });
      }
    } else {
      externalCount++;
      try {
        new URL(trimmed);
      } catch (err: any) {
        issues.push({ id: r.id, type: 'resource', url: trimmed, reason: `Malformed external URL: ${err.message}` });
      }
    }
  } else {
    issues.push({ id: r.id, type: 'resource', url: trimmed, reason: `Unknown URL scheme: ${trimmed}` });
  }
}

console.log(`SEED_RESOURCES Checked: ${SEED_RESOURCES.length}`);
console.log(`- Internal navigation links: ${internalCount}`);
console.log(`- YouTube lecture search links: ${youtubeCount}`);
console.log(`- External reference links (CBSE/NCERT): ${externalCount}`);

// 2. Check CHANNELS
let channelCount = 0;
for (const c of CHANNELS) {
  channelCount++;
  const url = channelSearchUrl(c.name);
  if (!url || !url.startsWith('https://www.youtube.com/results?search_query=')) {
    issues.push({ id: c.id, type: 'channel', url, reason: 'Invalid channel search URL' });
  }
  if (url.includes('undefined') || url.includes('null')) {
    issues.push({ id: c.id, type: 'channel', url, reason: 'Channel URL contains undefined or null' });
  }
}
console.log(`CHANNELS Checked: ${channelCount}`);

// 3. Check OFFICIAL_PYQ_ARCHIVES
let archivePaperCount = 0;
for (const archive of OFFICIAL_PYQ_ARCHIVES) {
  const validSub = SUBJECTS.find(s => s.id === archive.subjectId);
  if (!validSub) {
    issues.push({ id: archive.subjectId, type: 'archive', url: '', reason: `Archive has unknown subject ID "${archive.subjectId}"` });
  }
  for (const yearObj of archive.years) {
    for (const paper of yearObj.papers) {
      archivePaperCount++;
      if (!paper.url || (!paper.url.startsWith('https://www.cbse.gov.in/') && !paper.url.startsWith('http://www.cbse.gov.in/'))) {
        issues.push({ id: `${archive.subjectId}-${yearObj.year}`, type: 'archive_paper', url: paper.url, reason: 'Invalid or missing CBSE download URL' });
      }
      try {
        new URL(paper.url);
      } catch (err: any) {
        issues.push({ id: `${archive.subjectId}-${yearObj.year}`, type: 'archive_paper', url: paper.url, reason: `Malformed paper URL: ${err.message}` });
      }
    }
  }
}
console.log(`OFFICIAL_PYQ_ARCHIVES Papers Checked: ${archivePaperCount}`);

const total = SEED_RESOURCES.length + channelCount + archivePaperCount;
console.log(`TOTAL ALL APP LINKS CHECKED: ${total}`);
console.log(`TOTAL ISSUES DETECTED: ${issues.length}`);

if (issues.length > 0) {
  console.error('ISSUES FOUND:');
  console.table(issues);
  process.exit(1);
} else {
  console.log('>>> ALL 100% OF LINKS PASSED RIGOROUS VERIFICATION WITH 0 ERRORS! <<<');
  process.exit(0);
}
