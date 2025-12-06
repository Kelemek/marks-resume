// TypeScript interfaces for Supabase data
// These match the database schema

export interface Skill {
  id: string;
  name: string;
  years: string;
  category: 'systems' | 'development';
  sort_order: number;
}

export interface Certificate {
  id: string;
  title: string;
  institution: string;
  pdf_path: string | null;
  aria_label: string | null;
  category: 'education' | 'scrimba';
  sort_order: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
  responsibilities: string[];
  sort_order: number;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

// Transformed resume data for components (matches existing interface)
export interface ResumeData {
  systemsSoftware: { name: string; years: string }[];
  developmentSoftware: { name: string; years: string }[];
  certificates: { title: string; institution: string; pdfPath?: string; ariaLabel?: string }[];
  scrimbaCertificates: { title: string; institution: string; pdfPath?: string; ariaLabel?: string }[];
  jobs: {
    title: string;
    company: string;
    location: string;
    period: string;
    achievements?: string[];
    responsibilities?: string[];
  }[];
  itStartYear: number;
}
