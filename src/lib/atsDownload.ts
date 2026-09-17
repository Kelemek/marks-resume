import type { AtsDownloadPayload, ResumeData } from './types';
import { calculateITExperience } from './experience';
import { formatProfileSummaryForAts } from './profileSummary';
import { resumeIdentity } from './resumeIdentity';

export function toAtsDownloadPayload(data: ResumeData): AtsDownloadPayload {
  return {
    systemsSoftware: data.systemsSoftware,
    developmentSoftware: data.developmentSoftware,
    certificates: data.certificates.map(({ title, institution }) => ({ title, institution })),
    scrimbaCertificates: data.scrimbaCertificates.map(({ title, institution }) => ({
      title,
      institution,
    })),
    jobs: data.jobs,
    itStartYear: data.itStartYear,
  };
}

function sectionDivider(title: string): string {
  return `${title}\n${'-'.repeat(50)}\n`;
}

export function buildAtsDocumentText(payload: AtsDownloadPayload): string {
  const experienceYears = calculateITExperience(payload.itStartYear);

  let text = `
=====================================
           ${resumeIdentity.atsName}
=====================================

${resumeIdentity.phone} | ${resumeIdentity.email}
${resumeIdentity.address}

`;

  text += sectionDivider('PROFESSIONAL SUMMARY');
  text += `${formatProfileSummaryForAts(experienceYears)}\n\n`;

  text += sectionDivider('PROFESSIONAL EXPERIENCE');

  payload.jobs.forEach((job) => {
    text += `\n${job.title}\n`;
    text += `${job.company}, ${job.location} | ${job.period}\n`;

    if (job.achievements && job.achievements.length > 0) {
      text += '\nAchievements:\n';
      job.achievements.forEach((achievement) => {
        text += `• ${achievement}\n`;
      });
    }

    if (job.responsibilities && job.responsibilities.length > 0) {
      text += '\nResponsibilities:\n';
      job.responsibilities.forEach((responsibility) => {
        text += `• ${responsibility}\n`;
      });
    }
    text += '\n';
  });

  text += sectionDivider('TECHNICAL SKILLS');

  if (payload.systemsSoftware.length > 0) {
    text += `\nSystems & Software:\n`;
    payload.systemsSoftware.forEach((skill) => {
      text += `• ${skill.name} - ${skill.years}\n`;
    });
  }

  if (payload.developmentSoftware.length > 0) {
    text += `\nDevelopment & Software:\n`;
    payload.developmentSoftware.forEach((skill) => {
      text += `• ${skill.name} - ${skill.years}\n`;
    });
  }

  text += `\n${sectionDivider('EDUCATION & CERTIFICATIONS')}`;

  if (payload.certificates.length > 0) {
    payload.certificates.forEach((cert) => {
      text += `• ${cert.title} - ${cert.institution}\n`;
    });
  }

  if (payload.scrimbaCertificates.length > 0) {
    text += `\nScrimba Certificates:\n`;
    payload.scrimbaCertificates.forEach((cert) => {
      text += `• ${cert.title} - ${cert.institution}\n`;
    });
  }

  return text;
}
