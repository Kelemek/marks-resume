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

    // Render dynamic content
    renderSkills();
    renderEducation();
    
    // Mobile hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
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
        
        // Extract skills from data (since they're now dynamically rendered)
        textContent += `TECHNICAL SKILLS\n`;
        textContent += `${'-'.repeat(50)}\n`;
        
        // Extract Systems & Software skills
        if (resumeData.systemsSoftware && resumeData.systemsSoftware.length > 0) {
            textContent += `\nSystems & Software:\n`;
            resumeData.systemsSoftware.forEach(skill => {
                textContent += `• ${skill.name} - ${skill.years}\n`;
            });
        }
        
        // Extract Development & Software skills  
        if (resumeData.developmentSoftware && resumeData.developmentSoftware.length > 0) {
            textContent += `\nDevelopment & Software:\n`;
            resumeData.developmentSoftware.forEach(skill => {
                textContent += `• ${skill.name} - ${skill.years}\n`;
            });
        }
        
        // Extract education and certifications from data (since they're now dynamically rendered)
        textContent += `\nEDUCATION & CERTIFICATIONS\n`;
        textContent += `${'-'.repeat(50)}\n`;
        
        if (resumeData.certificates && resumeData.certificates.length > 0) {
            resumeData.certificates.forEach(cert => {
                textContent += `• ${cert.title} - ${cert.institution}\n`;
            });
        }
        
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

// Check for saved theme preference or default to system preference
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    // Use saved preference
    body.setAttribute('data-theme', savedTheme);
    updateThemeText(savedTheme);
} else {
    // Default to system preference
    const systemTheme = prefersDarkScheme ? 'dark' : 'light';
    body.setAttribute('data-theme', systemTheme);
    updateThemeText(systemTheme);
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

// Function to show certificate modal
function showCertificate(pdfPath) {
    if (pdfPath && certModal && certViewer) {
        // Add parameters to hide PDF viewer controls
        const cleanPdfUrl = `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`;
        certViewer.src = cleanPdfUrl;
        certModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

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

// Dynamic content rendering functions
function renderSkills() {
    const systemsGrid = document.getElementById('systems-software-grid');
    const developmentGrid = document.getElementById('development-software-grid');
    
    if (systemsGrid && resumeData.systemsSoftware) {
        systemsGrid.innerHTML = '';
        resumeData.systemsSoftware.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <div class="skill-card-content">
                    <h4 ${skill.id ? `id="${skill.id}"` : ''}>${skill.name}</h4>
                    <p>${skill.years}</p>
                </div>
            `;
            systemsGrid.appendChild(skillCard);
        });
    }
    
    if (developmentGrid && resumeData.developmentSoftware) {
        developmentGrid.innerHTML = '';
        resumeData.developmentSoftware.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <div class="skill-card-content">
                    <h4>${skill.name}</h4>
                    <p>${skill.years}</p>
                </div>
            `;
            developmentGrid.appendChild(skillCard);
        });
    }
}

function renderEducation() {
    const educationGrid = document.getElementById('education-grid');
    
    if (educationGrid) {
        educationGrid.innerHTML = '';
        
        // Render regular certificates
        if (resumeData.certificates) {
            resumeData.certificates.forEach(cert => {
                const certCard = document.createElement('div');
                certCard.className = 'education-card';
                
                let cardContent = `
                    <div class="education-card-content">
                        <h3>${cert.title}</h3>
                        <p>${cert.institution}</p>
                    </div>
                `;
                
                // Add certificate button if PDF is available
                if (cert.pdfPath) {
                    cardContent += `
                        <button class="cert-button" data-cert="${cert.pdfPath}" aria-label="${cert.ariaLabel || 'View ' + cert.title}">
                            <div class="cert-icon"></div>
                            <span class="cert-text">View</span>
                        </button>
                    `;
                }
                
                certCard.innerHTML = cardContent;
                educationGrid.appendChild(certCard);
            });
        }
        
        // Render Scrimba certificates as stacked card
        if (resumeData.scrimbaCertificates && resumeData.scrimbaCertificates.length > 0) {
            const stackedCard = document.createElement('div');
            stackedCard.className = 'stacked-card-container';
            stackedCard.innerHTML = `
                <div class="stacked-card" id="scrimbaStack">
                    <div class="stacked-card-header">
                        <h3>Scrimba Certificates (${resumeData.scrimbaCertificates.length})</h3>
                        <button class="stack-toggle" aria-label="Toggle Scrimba certificates">
                            <span class="stack-toggle-icon">▼</span>
                        </button>
                    </div>
                    <div class="stacked-card-content">
                        ${resumeData.scrimbaCertificates.map(cert => `
                            <div class="education-card scrimba-cert-card">
                                <div class="education-card-content">
                                    <h3>${cert.title}</h3>
                                    <p>${cert.institution}</p>
                                </div>
                                ${cert.pdfPath ? `
                                    <button class="cert-button" data-cert="${cert.pdfPath}" aria-label="${cert.ariaLabel || 'View ' + cert.title}">
                                        <div class="cert-icon"></div>
                                        <span class="cert-text">View</span>
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            educationGrid.appendChild(stackedCard);
            
            // Add toggle functionality
            const stackHeader = stackedCard.querySelector('.stacked-card-header');
            const stackToggle = stackedCard.querySelector('.stack-toggle');
            const stackContent = stackedCard.querySelector('.stacked-card-content');
            const stackIcon = stackedCard.querySelector('.stack-toggle-icon');
            
            const toggleStack = () => {
                stackedCard.querySelector('.stacked-card').classList.toggle('expanded');
                stackIcon.textContent = stackedCard.querySelector('.stacked-card').classList.contains('expanded') ? '▲' : '▼';
            };
            
            stackHeader.addEventListener('click', toggleStack);
            stackHeader.style.cursor = 'pointer';
        }
        
        // Re-attach event listeners for certificate buttons
        attachCertificateEventListeners();
    }
}

function attachCertificateEventListeners() {
    const certButtons = document.querySelectorAll('.cert-button');
    certButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = button.getAttribute('data-cert');
            if (pdfUrl) {
                showCertificate(pdfUrl);
            }
        });
    });
}

