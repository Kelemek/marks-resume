import type { Certificate, Job, Settings, Skill } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function requireString(record: Record<string, unknown>, key: string, label: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label}: expected non-empty string for "${key}"`);
  }
  return value;
}

function requireStringArray(record: Record<string, unknown>, key: string, label: string): string[] {
  const value = record[key];
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`${label}: expected string[] for "${key}"`);
  }
  return value;
}

export function parseSkills(data: unknown): Skill[] {
  if (!Array.isArray(data)) {
    throw new Error('Skills fetch failed: expected an array of rows');
  }

  return data.map((row, index) => {
    const label = `Skills row ${index}`;
    if (!isRecord(row)) {
      throw new Error(`${label}: expected an object`);
    }

    const category = row.category;
    if (category !== 'systems' && category !== 'development') {
      throw new Error(`${label}: invalid category "${String(category)}"`);
    }

    const sortOrder = row.sort_order;
    if (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder)) {
      throw new Error(`${label}: expected numeric sort_order`);
    }

    return {
      id: requireString(row, 'id', label),
      name: requireString(row, 'name', label),
      years: requireString(row, 'years', label),
      category,
      sort_order: sortOrder,
    };
  });
}

export function parseCertificates(data: unknown): Certificate[] {
  if (!Array.isArray(data)) {
    throw new Error('Certificates fetch failed: expected an array of rows');
  }

  return data.map((row, index) => {
    const label = `Certificates row ${index}`;
    if (!isRecord(row)) {
      throw new Error(`${label}: expected an object`);
    }

    const category = row.category;
    if (category !== 'education' && category !== 'scrimba') {
      throw new Error(`${label}: invalid category "${String(category)}"`);
    }

    const pdfPath = row.pdf_path;
    if (pdfPath !== null && typeof pdfPath !== 'string') {
      throw new Error(`${label}: pdf_path must be a string or null`);
    }

    const ariaLabel = row.aria_label;
    if (ariaLabel !== null && typeof ariaLabel !== 'string') {
      throw new Error(`${label}: aria_label must be a string or null`);
    }

    const sortOrder = row.sort_order;
    if (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder)) {
      throw new Error(`${label}: expected numeric sort_order`);
    }

    return {
      id: requireString(row, 'id', label),
      title: requireString(row, 'title', label),
      institution: requireString(row, 'institution', label),
      pdf_path: pdfPath,
      aria_label: ariaLabel,
      category,
      sort_order: sortOrder,
    };
  });
}

export function parseJobs(data: unknown): Job[] {
  if (!Array.isArray(data)) {
    throw new Error('Jobs fetch failed: expected an array of rows');
  }

  return data.map((row, index) => {
    const label = `Jobs row ${index}`;
    if (!isRecord(row)) {
      throw new Error(`${label}: expected an object`);
    }

    const sortOrder = row.sort_order;
    if (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder)) {
      throw new Error(`${label}: expected numeric sort_order`);
    }

    return {
      id: requireString(row, 'id', label),
      title: requireString(row, 'title', label),
      company: requireString(row, 'company', label),
      location: requireString(row, 'location', label),
      period: requireString(row, 'period', label),
      achievements: requireStringArray(row, 'achievements', label),
      responsibilities: requireStringArray(row, 'responsibilities', label),
      sort_order: sortOrder,
    };
  });
}

export function parseItStartYearSettings(data: unknown): Settings {
  if (!isRecord(data)) {
    throw new Error('Settings fetch failed: expected a settings row');
  }

  const key = requireString(data, 'key', 'Settings');
  if (key !== 'it_start_year') {
    throw new Error(`Settings fetch failed: unexpected key "${key}"`);
  }

  const value = requireString(data, 'value', 'Settings');
  const year = parseInt(value, 10);
  const currentYear = new Date().getFullYear();
  if (!Number.isFinite(year) || year < 1900 || year > currentYear) {
    throw new Error(`Settings fetch failed: invalid it_start_year value "${value}"`);
  }

  return {
    id: requireString(data, 'id', 'Settings'),
    key,
    value,
  };
}

export function itStartYearFromSettings(settings: Settings): number {
  return parseInt(settings.value, 10);
}
