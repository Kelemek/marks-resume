import { supabaseAdmin } from './supabaseAdmin';
import type { Skill, Certificate, Job, Settings, ResumeData } from './types';

// Supabase Storage bucket name for certificates
const STORAGE_BUCKET = 'certificates';

/**
 * Converts a storage path to a public URL
 * If the path is already a full URL, returns it as-is
 * If it's a relative path, generates a Supabase Storage public URL
 */
function getStorageUrl(path: string | null): string | null {
  if (!path) return null;
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with /, it's a local public path (for backwards compatibility)
  if (path.startsWith('/')) {
    return path;
  }
  
  // Otherwise, generate Supabase Storage public URL
  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function getResumeData(): Promise<ResumeData> {
  // Fetch all data in parallel
  const [skillsResult, certificatesResult, jobsResult, settingsResult] = await Promise.all([
    supabaseAdmin.from('skills').select('*').order('sort_order'),
    supabaseAdmin.from('certificates').select('*').order('sort_order'),
    supabaseAdmin.from('jobs').select('*').order('sort_order'),
    supabaseAdmin.from('settings').select('*').eq('key', 'it_start_year').single()
  ]);

  // Check for errors
  if (skillsResult.error) throw new Error(`Skills fetch failed: ${skillsResult.error.message}`);
  if (certificatesResult.error) throw new Error(`Certificates fetch failed: ${certificatesResult.error.message}`);
  if (jobsResult.error) throw new Error(`Jobs fetch failed: ${jobsResult.error.message}`);
  if (settingsResult.error) throw new Error(`Settings fetch failed: ${settingsResult.error.message}`);

  const skills = skillsResult.data as Skill[];
  const certificates = certificatesResult.data as Certificate[];
  const jobs = jobsResult.data as Job[];
  const settings = settingsResult.data as Settings;

  // Transform data to match existing component interface
  return {
    systemsSoftware: skills
      .filter(s => s.category === 'systems')
      .map(s => ({ name: s.name, years: s.years })),
    
    developmentSoftware: skills
      .filter(s => s.category === 'development')
      .map(s => ({ name: s.name, years: s.years })),
    
    certificates: certificates
      .filter(c => c.category === 'education')
      .map(c => {
        const pdfUrl = getStorageUrl(c.pdf_path);
        return {
          title: c.title,
          institution: c.institution,
          ...(pdfUrl && { pdfPath: pdfUrl }),
          ...(c.aria_label && { ariaLabel: c.aria_label })
        };
      }),
    
    scrimbaCertificates: certificates
      .filter(c => c.category === 'scrimba')
      .map(c => {
        const pdfUrl = getStorageUrl(c.pdf_path);
        return {
          title: c.title,
          institution: c.institution,
          ...(pdfUrl && { pdfPath: pdfUrl }),
          ...(c.aria_label && { ariaLabel: c.aria_label })
        };
      }),
    
    jobs: jobs.map(j => ({
      title: j.title,
      company: j.company,
      location: j.location,
      period: j.period,
      ...(j.achievements.length > 0 && { achievements: j.achievements }),
      ...(j.responsibilities.length > 0 && { responsibilities: j.responsibilities })
    })),
    
    itStartYear: parseInt(settings.value, 10)
  };
}

/**
 * Calculate years of IT experience based on start year
 */
export function calculateITExperience(startYear: number): number {
  return new Date().getFullYear() - startYear;
}
