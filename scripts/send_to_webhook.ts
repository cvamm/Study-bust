import { SUBJECTS } from '../src/data/subjects';
import { SEED_RESOURCES } from '../src/data/resources';
import { CHANNELS } from '../src/data/channels';
import { OFFICIAL_PYQ_ARCHIVES } from '../src/data/officialPyqPapers';

const WEBHOOK_URL = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjMwNTZlMDYzNzA0MzI1MjZiNTUzMiI_3D_pc/IjU3NjcwNTY4MDYzZjA0MzU1MjZkNTUzNDUxMzUi_pc";

async function run() {
  console.log("Compiling StudyBust 12 complete dataset...");

  // 1. Mentor Session Form Data Schema
  const mentorData = {
    event: "mentorship_session_booking",
    platform: "StudyBust 12",
    timestamp: new Date().toISOString(),
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone_no: "+91 98765 43210",
    phone: "+91 98765 43210",
    subject: "Physics",
    reason: "Backlog clearing in Electrostatics & Ray Optics, need 1-on-1 strategy & PYQ roadmap",
    fee: "₹100",
    amount: 100,
    currency: "INR",
    session_type: "1-on-1 Mentorship Session with Shivam (30 min)",
    status: "Request Received"
  };

  console.log("Sending Mentor Session data...");
  const res1 = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mentorData)
  });
  console.log("Mentor Session Webhook Status:", res1.status, await res1.text());

  // 2. Complete Platform Catalog Data Export
  const catalogData = {
    event: "platform_catalog_export",
    platform: "StudyBust 12",
    timestamp: new Date().toISOString(),
    developer: "Shivam Shukla",
    email: "cvamm69@gmail.com",
    total_subjects: SUBJECTS.length,
    total_resources: SEED_RESOURCES.length,
    total_channels: CHANNELS.length,
    total_official_archives: OFFICIAL_PYQ_ARCHIVES.length,
    subjects: SUBJECTS.map(s => ({
      id: s.id,
      name: s.name,
      code: s.code,
      stream: s.stream,
      chapters_count: s.chapters.length,
      chapters: s.chapters.map(c => ({ id: c.id, num: c.num, name: c.name, marks: c.marksWeightage }))
    })),
    channels: CHANNELS.map(c => ({
      name: c.name,
      handle: c.handle,
      stream: c.stream,
      subscribers: c.subscribers,
      url: c.url
    })),
    sample_resources: SEED_RESOURCES.slice(0, 50).map(r => ({
      id: r.id,
      title: r.title,
      subjectId: r.subjectId,
      type: r.type,
      source: r.source,
      url: r.url
    }))
  };

  console.log("Sending Platform Catalog summary data...");
  const res2 = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(catalogData)
  });
  console.log("Catalog Export Webhook Status:", res2.status, await res2.text());
}

run();
