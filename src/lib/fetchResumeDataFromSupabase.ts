/// <reference path="../env.server.d.ts" />
import { supabaseAdmin } from './supabaseAdmin';
import type { ResumeData } from './types';
import {
  itStartYearFromSettings,
  parseCertificates,
  parseItStartYearSettings,
  parseJobs,
  parseSkills,
} from './parseResumeRows';

const STORAGE_BUCKET = 'certificates';

function getStorageUrl(path: string | null): string | null {
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function mapCertificate(c: ReturnType<typeof parseCertificates>[number]) {
  const pdfUrl = getStorageUrl(c.pdf_path);
  return {
    title: c.title,
    institution: c.institution,
    ...(pdfUrl && { pdfPath: pdfUrl }),
    ...(c.aria_label && { ariaLabel: c.aria_label }),
  };
}

export async function fetchResumeDataFromSupabase(): Promise<ResumeData> {
  const [skillsResult, certificatesResult, jobsResult, settingsResult] = await Promise.all([
    supabaseAdmin.from('skills').select('*').order('sort_order'),
    supabaseAdmin.from('certificates').select('*').order('sort_order'),
    supabaseAdmin.from('jobs').select('*').order('sort_order'),
    supabaseAdmin.from('settings').select('*').eq('key', 'it_start_year').single(),
  ]);

  if (skillsResult.error) throw new Error(`Skills fetch failed: ${skillsResult.error.message}`);
  if (certificatesResult.error) {
    throw new Error(`Certificates fetch failed: ${certificatesResult.error.message}`);
  }
  if (jobsResult.error) throw new Error(`Jobs fetch failed: ${jobsResult.error.message}`);
  if (settingsResult.error) throw new Error(`Settings fetch failed: ${settingsResult.error.message}`);

  const skills = parseSkills(skillsResult.data);
  const certificates = parseCertificates(certificatesResult.data);
  const jobs = parseJobs(jobsResult.data);
  const settings = parseItStartYearSettings(settingsResult.data);

  return {
    systemsSoftware: skills
      .filter((s) => s.category === 'systems')
      .map((s) => ({ name: s.name, years: s.years })),

    developmentSoftware: skills
      .filter((s) => s.category === 'development')
      .map((s) => ({ name: s.name, years: s.years })),

    certificates: certificates
      .filter((c) => c.category === 'education')
      .map(mapCertificate),

    scrimbaCertificates: certificates
      .filter((c) => c.category === 'scrimba')
      .map(mapCertificate),

    jobs: jobs.map((j) => ({
      title: j.title,
      company: j.company,
      location: j.location,
      period: j.period,
      ...(j.achievements.length > 0 && { achievements: j.achievements }),
      ...(j.responsibilities.length > 0 && { responsibilities: j.responsibilities }),
    })),

    itStartYear: itStartYearFromSettings(settings),
  };
}
