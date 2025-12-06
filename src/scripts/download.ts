import { saveAs } from 'file-saver';
import { resumeData, calculateITExperience } from '../data/resumeData';

// Generate ATS-friendly plain text document
export function initDownload() {
  const button = document.getElementById('downloadPDF');
  if (!button) return;

  button.addEventListener('click', generateATSFriendlyDoc);
}

function generateATSFriendlyDoc() {
  const button = document.getElementById('downloadPDF') as HTMLButtonElement | null;
  if (!button) return;

  const originalText = button.textContent || '';
  button.textContent = 'Generating Document...';
  button.disabled = true;

  try {
    const experienceYears = calculateITExperience();
    
    // Build clean text document
    let textContent = `
=====================================
           MARK LARSON
=====================================

763.355.2923 | markdlarson@me.com
2130 Cleveland Lane S, Cambridge, MN 55008

`;
    
    textContent += `PROFESSIONAL SUMMARY\n`;
    textContent += `${'-'.repeat(50)}\n`;
    textContent += `Experienced Systems Engineer, Architect and Web Developer with ${experienceYears}+ years of comprehensive IT experience spanning full-stack web development, enterprise virtualization, and cloud infrastructure. Experience with designing and developing scalable web applications using ASP.NET, VB.NET, JavaScript, and SQL, with proven experience managing high-traffic eCommerce platforms including www.fingerhut.com and subsidiary sites.\n\n`;
    textContent += `Recently completed comprehensive Scrimba web development training (2025), staying current with modern JavaScript frameworks and responsive design principles. Expert in enterprise infrastructure management including Citrix environments, VMware vSphere, Active Directory, and cloud platforms (AWS/Azure).\n\n`;
    textContent += `Successfully led technology migrations, automated deployment processes, and delivered performance optimizations across web applications and virtualized infrastructure. Combines hands-on development skills with strategic infrastructure architecture, demonstrating continuous learning and adaptation to evolving web technologies.\n\n`;
    
    textContent += `PROFESSIONAL EXPERIENCE\n`;
    textContent += `${'-'.repeat(50)}\n`;
    
    // Extract job experience from data
    resumeData.jobs.forEach(job => {
      textContent += `\n${job.title}\n`;
      textContent += `${job.company}, ${job.location} | ${job.period}\n`;

      if (job.achievements && job.achievements.length > 0) {
        textContent += '\nAchievements:\n';
        job.achievements.forEach(achievement => {
          textContent += `• ${achievement}\n`;
        });
      }

      if (job.responsibilities && job.responsibilities.length > 0) {
        textContent += '\nResponsibilities:\n';
        job.responsibilities.forEach(responsibility => {
          textContent += `• ${responsibility}\n`;
        });
      }
      textContent += '\n';
    });
    
    // Extract skills from data
    textContent += `TECHNICAL SKILLS\n`;
    textContent += `${'-'.repeat(50)}\n`;
    
    if (resumeData.systemsSoftware && resumeData.systemsSoftware.length > 0) {
      textContent += `\nSystems & Software:\n`;
      resumeData.systemsSoftware.forEach(skill => {
        textContent += `• ${skill.name} - ${skill.years}\n`;
      });
    }
    
    if (resumeData.developmentSoftware && resumeData.developmentSoftware.length > 0) {
      textContent += `\nDevelopment & Software:\n`;
      resumeData.developmentSoftware.forEach(skill => {
        textContent += `• ${skill.name} - ${skill.years}\n`;
      });
    }
    
    // Extract education and certifications
    textContent += `\nEDUCATION & CERTIFICATIONS\n`;
    textContent += `${'-'.repeat(50)}\n`;
    
    if (resumeData.certificates && resumeData.certificates.length > 0) {
      resumeData.certificates.forEach(cert => {
        textContent += `• ${cert.title} - ${cert.institution}\n`;
      });
    }
    
    // Add Scrimba certificates
    if (resumeData.scrimbaCertificates && resumeData.scrimbaCertificates.length > 0) {
      textContent += `\nScrimba Certificates:\n`;
      resumeData.scrimbaCertificates.forEach(cert => {
        textContent += `• ${cert.title} - ${cert.institution}\n`;
      });
    }
    
    // Create plain text file
    const blob = new Blob([textContent], { 
      type: 'text/plain;charset=utf-8' 
    });
    
    saveAs(blob, 'Mark_Dean_Larson_Resume_ATS.txt');
    
    // Restore button
    button.textContent = originalText;
    button.disabled = false;
    
  } catch (error) {
    console.error('Document generation failed:', error);
    button.textContent = 'Download Failed - Try Again';
    button.disabled = false;
    setTimeout(() => { button.textContent = 'Download Resume'; }, 3000);
  }
}
