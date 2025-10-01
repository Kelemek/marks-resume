// Calculate years of IT experience
function calculateITExperience() {
    const itStartYear = 1996;
    const currentYear = new Date().getFullYear();
    return currentYear - itStartYear;
}

// Update experience years on page load
document.addEventListener('DOMContentLoaded', function() {
    const experienceYears = calculateITExperience();

    // Update hero section
    const heroExperienceSpan = document.getElementById('hero-experience-years');
    if (heroExperienceSpan) {
        heroExperienceSpan.textContent = experienceYears + '+';
    }

    // Update professional profile
    const experienceSpan = document.getElementById('experience-years');
    if (experienceSpan) {
        experienceSpan.textContent = experienceYears + '+';
    }

    // Update Windows experience in skills section
    const windowsYears = document.getElementById('windows-years');
    if (windowsYears) {
        windowsYears.textContent = experienceYears + ' years';
    }
});

// Generate ATS-friendly plain text document
function generateATSFriendlyDoc() {
    const button = document.getElementById('downloadPDF');
    const originalText = button.textContent;
    button.textContent = 'Generating Document...';
    button.disabled = true;

    try {
        // Extract content from HTML in ATS-friendly format
        const name = document.querySelector('.hero-title')?.textContent?.trim() || 'Mark Dean Larson';
        const phone = document.querySelector('a[href^="tel:"]')?.textContent?.trim() || '';
        const email = document.querySelector('a[href^="mailto:"]')?.textContent?.trim() || '';
        const address = document.querySelector('a[href*="maps.apple.com"]')?.textContent?.trim() || '';
        
        // Get profile text and clean up whitespace
        const profileElement = document.querySelector('.profile-text');
        const profileText = profileElement ? 
            profileElement.textContent
                .replace(/\s+/g, ' ')  // Replace multiple spaces/newlines with single space
                .trim()                // Remove leading/trailing whitespace
            : '';
        
        // Build clean text document
        let textContent = `
=====================================
           MARK LARSON
=====================================

${phone} | ${email}
${address}

`;
        
        textContent += `PROFESSIONAL SUMMARY\n`;
        textContent += `${'-'.repeat(50)}\n`;
        textContent += `${profileText}\n\n`;
        
        textContent += `PROFESSIONAL EXPERIENCE\n`;
        textContent += `${'-'.repeat(50)}\n`;
        
        // Extract job experience
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const title = card.querySelector('.job-title')?.textContent?.trim() || '';
            const company = card.querySelector('.job-company')?.textContent?.trim() || '';
            const period = card.querySelector('.job-period')?.textContent?.trim() || '';
            
            textContent += `\n${title}\n`;
            textContent += `${company} | ${period}\n`;
            
            // Get achievements and responsibilities
            const achievements = card.querySelectorAll('.job-list li');
            if (achievements.length > 0) {
                textContent += '\n';
                achievements.forEach(achievement => {
                    const cleanText = achievement.textContent
                        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                        .trim();                // Remove leading/trailing whitespace
                    textContent += `• ${cleanText}\n`;
                });
            }
            textContent += '\n';
        });
        
        // Extract skills
        textContent += `TECHNICAL SKILLS\n`;
        textContent += `${'-'.repeat(50)}\n`;
        
        const skillSections = document.querySelectorAll('#skills h2.section-title');
        skillSections.forEach(section => {
            const sectionTitle = section.textContent?.replace(/\s+/g, ' ').trim();
            if (sectionTitle && sectionTitle !== 'Technical Skills') {
                textContent += `\n${sectionTitle}:\n`;
                const skillsContainer = section.nextElementSibling;
                if (skillsContainer) {
                    const skillCards = skillsContainer.querySelectorAll('.skill-card h3');
                    const skills = Array.from(skillCards).map(skill => 
                        skill.textContent.replace(/\s+/g, ' ').trim()
                    );
                    textContent += skills.join(', ') + '\n';
                }
            }
        });
        
        // Extract education
        textContent += `\nEDUCATION & CERTIFICATIONS\n`;
        textContent += `${'-'.repeat(50)}\n`;
        
        const eduCards = document.querySelectorAll('.education-card, .cert-card');
        eduCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent?.replace(/\s+/g, ' ').trim() || '';
            const details = card.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim() || '';
            if (title) {
                textContent += `\n${title}\n`;
                if (details) {
                    textContent += `${details}\n`;
                }
            }
        });
        
        // Create plain text file that Word can open
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
        setTimeout(() => { button.textContent = originalText; }, 3000);
    }
}

// Use ATS-friendly Word document generation
document.getElementById('downloadPDF').addEventListener('click', generateATSFriendlyDoc);

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeText = document.querySelector('.theme-text');
const body = document.body;

// Check for saved theme preference or default to dark theme
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeText(savedTheme);
} else if (!prefersDarkScheme) {
    // If user prefers light mode and no saved preference, switch to light
    body.setAttribute('data-theme', 'light');
    updateThemeText('light');
} else {
    // Default dark theme case - update the text to show correct option
    updateThemeText('dark');
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeText(newTheme);
});

// Update theme text based on current theme
function updateThemeText(theme) {
    if (theme === 'light') {
        themeText.textContent = 'Dark Mode';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
        themeText.textContent = 'Light Mode';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        body.setAttribute('data-theme', theme);
        updateThemeText(theme);
    }
});

// Certificate Modal Functionality
const certModal = document.getElementById('certModal');
const certViewer = document.getElementById('certViewer');
const closeModal = document.querySelector('.close');
const certButtons = document.querySelectorAll('.cert-button');

// Add click event listeners to all certificate buttons
certButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const certPath = e.currentTarget.getAttribute('data-cert');
        if (certPath) {
            // Add parameters to hide PDF viewer controls
            const cleanPdfUrl = `${certPath}#toolbar=0&navpanes=0&scrollbar=0`;
            certViewer.src = cleanPdfUrl;
            certModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

// Close modal when clicking the X button
closeModal.addEventListener('click', () => {
    certModal.style.display = 'none';
    certViewer.src = ''; // Clear the iframe
    document.body.style.overflow = 'auto'; // Restore scrolling
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === certModal) {
        certModal.style.display = 'none';
        certViewer.src = ''; // Clear the iframe
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.style.display === 'block') {
        certModal.style.display = 'none';
        certViewer.src = ''; // Clear the iframe
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
});