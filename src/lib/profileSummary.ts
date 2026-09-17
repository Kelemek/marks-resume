/** Shared professional summary copy for Profile section and ATS download. */

export const profileSummaryLead = {
  beforeYears:
    'Experienced Systems Engineer, Architect and Web Developer with ',
  afterYears:
    ' years of comprehensive IT experience spanning full-stack web development, enterprise virtualization, and cloud infrastructure. Experience with designing and developing scalable web applications using ASP.NET, VB.NET, JavaScript, and SQL, with proven experience managing high-traffic eCommerce platforms including www.fingerhut.com and subsidiary sites.',
};

export const profileSummaryParagraph2 =
  'Recently completed comprehensive Scrimba web development training (2025), staying current with modern JavaScript frameworks and responsive design principles. Expert in enterprise infrastructure management including Citrix environments, VMware vSphere, Active Directory, and cloud platforms (AWS/Azure).';

export const profileSummaryParagraph3 =
  'Successfully led technology migrations, automated deployment processes, and delivered performance optimizations across web applications and virtualized infrastructure. Combines hands-on development skills with strategic infrastructure architecture, demonstrating continuous learning and adaptation to evolving web technologies.';

export function formatProfileSummaryLeadPlain(experienceYears: number): string {
  return `${profileSummaryLead.beforeYears}${experienceYears}+${profileSummaryLead.afterYears}`;
}

export function formatProfileSummaryForAts(experienceYears: number): string {
  return `${formatProfileSummaryLeadPlain(experienceYears)}\n\n${profileSummaryParagraph2}\n\n${profileSummaryParagraph3}`;
}
