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

// PDF Download Functionality
document.getElementById('downloadPDF').addEventListener('click', function() {
    // Show loading state
    const button = this;
    const originalText = button.textContent;
    button.textContent = 'Generating PDF...';
    button.disabled = true;
    
    // Hide the navbar for PDF generation
    const navbar = document.querySelector('.navbar');
    const originalNavDisplay = navbar.style.display;
    navbar.style.display = 'none';
    
    // Temporarily adjust main content padding
    const mainContent = document.querySelector('.main-content');
    const originalPadding = mainContent.style.paddingTop;
    mainContent.style.paddingTop = '0';
    
    // Configure PDF options
    const opt = {
        margin: 0.5,
        filename: 'Mark_Dean_Larson_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Generate PDF
    html2pdf().set(opt).from(document.body).save().then(() => {
        // Restore original styles
        navbar.style.display = originalNavDisplay;
        mainContent.style.paddingTop = originalPadding;
        
        // Restore button state
        button.textContent = originalText;
        button.disabled = false;
    }).catch((error) => {
        console.error('PDF generation failed:', error);
        
        // Restore original styles even on error
        navbar.style.display = originalNavDisplay;
        mainContent.style.paddingTop = originalPadding;
        
        // Restore button state
        button.textContent = 'Download Failed - Try Again';
        button.disabled = false;
        
        // Reset button text after a delay
        setTimeout(() => {
            button.textContent = originalText;
        }, 3000);
    });
});

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