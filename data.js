// Resume data for dynamic rendering
const resumeData = {
    // Skills data
    systemsSoftware: [
        { name: "Windows NT 3.5 - 2025", years: "29 years", id: "windows-years" },
        { name: "VMWare ESX/ESXi 3.5 - 8", years: "16 years" },
        { name: "Active Directory", years: "20 years" },
        { name: "Citrix Apps & Desktops", years: "10 years" },
        { name: "Exchange 5.5 - 2010", years: "10 years" },
        { name: "Citrix Netscaler/ADC 9 - 12", years: "10 years" },
        { name: "Apple MacOS 10.4 - 26", years: "10 years" },
        { name: "SQL Server 6.5 - 2019", years: "10 years" },
        { name: "Azure SQL", years: "2 years" },
        { name: "IIS 3 - 7", years: "9 years" },
        { name: "VBScript", years: "8 years" },
        { name: "ControlUP", years: "6 years" }
    ],
    
    developmentSoftware: [
        { name: "Visual Studio", years: "4 years" },
        { name: "VS Code", years: "2 years" },
        { name: "ASP.net", years: "4 years" },
        { name: "VB.net", years: "4 years" },
        { name: "React", years: "1 year" },
        { name: "Next.JS", years: "1 year" },
        { name: "Supabase", years: "1 year" },
        { name: "CSS", years: "1 year" },
        { name: "JavaScript", years: "2 years" },
        { name: "TypeScript", years: "2 years" },
        { name: "Transact SQL", years: "2 years" },
        { name: "HTML", years: "2 years" },
        { name: "Powershell", years: "3 years" },
        { name: "Node.js", years: "1 year" },
        { name: "Github", years: "2 years" }
    ],
    
    // Certificates data
    certificates: [
        {
            title: "Brown Institute",
            institution: "Advertising Design - 1995",
            pdfPath: null,
            ariaLabel: null
        },
        {
            title: "School of Communication Arts",
            institution: "Computer Animation - 1995",
            pdfPath: null,
            ariaLabel: null
        },
        {
            title: "Microsoft Certified Professional",
            institution: "Workstation, Server Enterprise - 1999",
            pdfPath: null,
            ariaLabel: null
        },
        {
            title: "AZ 900 Certificate",
            institution: "Azure Fundamentals - 2024",
            pdfPath: "img/Credentials AZ900 - marklarson-7761 | Microsoft Learn.pdf",
            ariaLabel: "View AZ900 Certificate"
        },
        {
            title: "PL 900 Certificate",
            institution: "Power Platform Fundamentals - 2025",
            pdfPath: "img/Credentials PL900 - marklarson-7761 | Microsoft Learn.pdf",
            ariaLabel: "View PL900 Certificate"
        },
        {
            title: "Association of Certified Biblical Counselors",
            institution: "ACBC Certificate - 2024",
            pdfPath: "img/ACBC Certificate.pdf",
            ariaLabel: "View Biblical Counseling Certificate"
        },
        {
            title: "Javascript",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Javascript.pdf",
            ariaLabel: "View Javascript Certificate"
        },
        {
            title: "HTML and CSS",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn HTML and CSS.pdf",
            ariaLabel: "View HTML and CSS Certificate"
        },
        {
            title: "Learn Tailwind CSS",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Tailwind CSS.pdf",
            ariaLabel: "View Learn Tailwind CSS Certificate"
        },
        {
            title: "Learn CSS Variables",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/CSS Variables Tutorial - Learn CSS variables in this free course.pdf",
            ariaLabel: "View CSS Variables Certificate"
        },
        {
            title: "React",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn React.pdf",
            ariaLabel: "View React Certificate"
        },
        {
            title: "Learn Typescript",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Typescript.pdf",
            ariaLabel: "View Learn Typescript Certificate"
        },
        {
            title: "Intro to Supabase",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Intro to Supabase.pdf",
            ariaLabel: "View Intro to Supabase Certificate"
        },
        {
            title: "Intro to SQL",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Intro to SQL.pdf",
            ariaLabel: "View Intro to SQL Certificate"
        },
        {
            title: "Node.js",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Node.js.pdf",
            ariaLabel: "View Node.js Certificate"
        },
        {
            title: "Learn Express.js",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Express.js.pdf",
            ariaLabel: "View Express.js Certificate"
        },
        {
            title: "Learn Next.js",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Next.js.pdf",
            ariaLabel: "View Learn Next.js"
        },
        {
            title: "Intro to Model Context Protocol (MCP)",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Intro to Model Context Protocol (MCP).pdf",
            ariaLabel: "View Intro to Model Context Protocol (MCP)"
        },
        {
            title: "Intro to AI Engineering",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Intro to AI Engineering.pdf",
            ariaLabel: "View Intro to AI Engineering Certificate"
        },
        {
            title: "Learn RAG",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn RAG.pdf",
            ariaLabel: "View Learn RAG Certificate"
        },
        {
            title: "Learn AI Agents",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn AI Agents.pdf",
            ariaLabel: "View Learn AI Agents Certificate"
        },
        {
            title: "Intro to Vite",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Intro to Vite.pdf",
            ariaLabel: "View Intro to Vite Certificate"
        },
        {
            title: "Deploying with Netlify",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Deploying with Netlify.pdf",
            ariaLabel: "View Netlify Certificate"
        },
        {
            title: "Accessible Web Design",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/Learn Web Accessibility_ Free interactive course.pdf",
            ariaLabel: "View Web Accessibility Certificate"
        },
        {
            title: "UI Design Fundamentals",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/UI design fundamentals tutorial_ Learn to create beautiful and functional user interfaces in this free course.pdf",
            ariaLabel: "View UI Design Certificate"
        },
        {
            title: "Frontend Developer Path",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/The Front-End Developer Career Path_ Learn the skills you'll need to launch your career in web development.pdf",
            ariaLabel: "View Front-End Developer Certificate"
        },
        {
            title: "Full Stack Developer Path",
            institution: "Scrimba Certificate - 2025",
            pdfPath: "img/The Fullstack Developer Path.pdf",
            ariaLabel: "View Full Stack Developer Path"
        }
    ]
};