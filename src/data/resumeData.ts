// Type definitions for resume data
export interface Skill {
  name: string;
  years: string;
  id?: string;
}

export interface Certificate {
  title: string;
  institution: string;
  pdfPath: string | null;
  ariaLabel: string | null;
}

export interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  achievements?: string[];
  responsibilities?: string[];
}

export interface ResumeData {
  systemsSoftware: Skill[];
  developmentSoftware: Skill[];
  certificates: Certificate[];
  scrimbaCertificates: Certificate[];
  jobs: Job[];
}

// Calculate years of IT experience dynamically
export function calculateITExperience(): number {
  const itStartYear = 1996;
  const currentYear = new Date().getFullYear();
  return currentYear - itStartYear;
}

export const resumeData: ResumeData = {
  systemsSoftware: [
    { name: "Windows NT 3.5 - 2025", years: `${calculateITExperience()} years`, id: "windows-years" },
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
    { name: "TypeScript", years: "1 year" },
    { name: "JavaScript", years: "2 years" },
    { name: "Transact SQL", years: "2 years" },
    { name: "HTML", years: "2 years" },
    { name: "Powershell", years: "3 years" },
    { name: "Node.js", years: "1 year" },
    { name: "Github", years: "2 years" }
  ],

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
    }
  ],

  scrimbaCertificates: [
    { title: "Javascript", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Javascript.pdf", ariaLabel: "View Javascript Certificate" },
    { title: "HTML and CSS", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn HTML and CSS.pdf", ariaLabel: "View HTML and CSS Certificate" },
    { title: "Learn Tailwind CSS", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Tailwind CSS.pdf", ariaLabel: "View Learn Tailwind CSS Certificate" },
    { title: "Learn CSS Variables", institution: "Scrimba Certificate - 2025", pdfPath: "img/CSS Variables Tutorial - Learn CSS variables in this free course.pdf", ariaLabel: "View CSS Variables Certificate" },
    { title: "React", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn React.pdf", ariaLabel: "View React Certificate" },
    { title: "Learn Typescript", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Typescript.pdf", ariaLabel: "View Learn Typescript Certificate" },
    { title: "Intro to Supabase", institution: "Scrimba Certificate - 2025", pdfPath: "img/Intro to Supabase.pdf", ariaLabel: "View Intro to Supabase Certificate" },
    { title: "Intro to SQL", institution: "Scrimba Certificate - 2025", pdfPath: "img/Intro to SQL.pdf", ariaLabel: "View Intro to SQL Certificate" },
    { title: "Node.js", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Node.js.pdf", ariaLabel: "View Node.js Certificate" },
    { title: "Learn Express.js", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Express.js.pdf", ariaLabel: "View Express.js Certificate" },
    { title: "Learn Next.js", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Next.js.pdf", ariaLabel: "View Learn Next.js" },
    { title: "Intro to Model Context Protocol (MCP)", institution: "Scrimba Certificate - 2025", pdfPath: "img/Intro to Model Context Protocol (MCP).pdf", ariaLabel: "View Intro to Model Context Protocol (MCP)" },
    { title: "Intro to AI Engineering", institution: "Scrimba Certificate - 2025", pdfPath: "img/Intro to AI Engineering.pdf", ariaLabel: "View Intro to AI Engineering Certificate" },
    { title: "Learn RAG", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn RAG.pdf", ariaLabel: "View Learn RAG Certificate" },
    { title: "Learn AI Agents", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn AI Agents.pdf", ariaLabel: "View Learn AI Agents Certificate" },
    { title: "Intro to Vite", institution: "Scrimba Certificate - 2025", pdfPath: "img/Intro to Vite.pdf", ariaLabel: "View Intro to Vite Certificate" },
    { title: "Deploying with Netlify", institution: "Scrimba Certificate - 2025", pdfPath: "img/Deploying with Netlify.pdf", ariaLabel: "View Netlify Certificate" },
    { title: "Accessible Web Design", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Web Accessibility_ Free interactive course.pdf", ariaLabel: "View Web Accessibility Certificate" },
    { title: "UI Design Fundamentals", institution: "Scrimba Certificate - 2025", pdfPath: "img/UI design fundamentals tutorial_ Learn to create beautiful and functional user interfaces in this free course.pdf", ariaLabel: "View UI Design Certificate" },
    { title: "Prompt Engineering for Web dev", institution: "Scrimba Certificate - 2025", pdfPath: "img/Prompt Engineering for Web dev.pdf", ariaLabel: "View Prompt Engineering for Web dev" },
    { title: "Learn Vue.js", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Vue.pdf", ariaLabel: "View Learn Vue.js" },
    { title: "Learn Bootstrap", institution: "Scrimba Certificate - 2025", pdfPath: "img/Learn Bootstrap 4 in this hands-on course.pdf", ariaLabel: "View Learn Bootstrap" },
    { title: "Learn Advanced React", institution: "Scrimba Certificate - 2025", pdfPath: "img/Tutorial_ Learn Advanced React – A 13-hour interactive course lead by Bob Ziroll.pdf", ariaLabel: "View Learn Advanced React" },
    { title: "Unit Testing Tutorial", institution: "Scrimba Certificate - 2025", pdfPath: "img/Unit Testing Tutorial.pdf", ariaLabel: "View Unit Testing Tutorial" },
    { title: "Intro to Astro", institution: "Scrimba Certificate - 2025", pdfPath: "img/Intro to Astro.pdf", ariaLabel: "View Intro to Astro" },
    { title: "Svelte JS Tutorial", institution: "Scrimba Certificate - 2025", pdfPath: "img/Svelte JS Tutorial.pdf", ariaLabel: "View Svelte JS Tutorial" },
    { title: "ChatGPT Tutorial for Programming", institution: "Scrimba Certificate - 2025", pdfPath: "img/ChatGPT Tutorial for Programming.pdf", ariaLabel: "View ChatGPT Tutorial for Programming" },
    { title: "Clean Code Tutorial", institution: "Scrimba Certificate - 2025", pdfPath: "img/Clean Code Tutorial.pdf", ariaLabel: "View Clean Code Tutorial" },
    { title: "Frontend Developer Path", institution: "Scrimba Certificate - 2025", pdfPath: "img/The Front-End Developer Career Path_ Learn the skills you'll need to launch your career in web development.pdf", ariaLabel: "View Front-End Developer Certificate" },
    { title: "Full Stack Developer Path", institution: "Scrimba Certificate - 2025", pdfPath: "img/The Fullstack Developer Path.pdf", ariaLabel: "View Full Stack Developer Path" },
    { title: "The AI Engeneer Path", institution: "Scrimba Certificate - 2025", pdfPath: "img/The AI Engineer Path_ Learn to Build generative AI-powered apps and advance your web development skills.pdf", ariaLabel: "View The AI Engeneer Path" },
    { title: "The Backend Developter Path", institution: "Scrimba Certificate - 2025", pdfPath: "img/The Backend Developer Path.pdf", ariaLabel: "View The Backend Developer Path" }
  ],

  jobs: [
    {
      title: "Systems Engineer II",
      company: "Mercy Ships",
      location: "Lindale, TX",
      period: "June 2023 - Present",
      achievements: [
        "Setup and tested a POC of the Action1 product for software distribution and patching of the server environment.",
        "Implemented Action1 to replace Microsoft WSUS for OS and third party patching of the server environment.",
        "Upgraded all Microsoft SQL servers to version 2019 and standardized the patching process with Action1.",
        "Upgraded all Windows 2012 servers to Windows 2019 and 2022.",
        "Vulnerability management across the Windows server environment."
      ],
      responsibilities: [
        "Administration setup and support of all server infrastructure spanning across two hospital ships and the headquarters.",
        "Administration setup and support of all VMware vSphere infrastructure.",
        "Administration setup and support of all Azure infrastructure in both US east and France regions.",
        "Administration setup and support of all Microsoft SQL servers.",
        "Administration setup and support of all Windows infrastructure and application servers including AD and GPO management."
      ]
    },
    {
      title: "Sr. Systems Architect",
      company: "Sonata Software",
      location: "Eden Prairie, MN",
      period: "2023 - June 2023",
      responsibilities: [
        "Continued providing enterprise Citrix and virtualization expertise to Bluestem Brands through outsourcing transition, maintaining seamless operations during organizational change."
      ]
    },
    {
      title: "Sr. Systems Architect",
      company: "Bluestem Brands",
      location: "Eden Prairie, MN",
      period: "2011 - 2023",
      achievements: [
        "Orchestrated comprehensive Citrix infrastructure evolution from Windows 2008R2 to 2022 using App Layering (70+ app layers, 2 platform layers) and full stack upgrades (DDC, Storefront, Director, PVS, WEM, Netscalers).",
        "Achieved 20% memory savings across 50-server XenApp farm through Citrix Workspace Environment Management implementation.",
        "Architected secure PCI-compliant XenApp environment and deployed enterprise Lastpass with Azure AD federation.",
        "Modernized infrastructure by migrating thin clients (HP to Dell/Wyse), VPN (Juniper to Netscaler), and profiles (UPM to FSLogix).",
        "Enhanced monitoring capabilities with comprehensive suite: VMTurbo, ControlUP, Edgesight, EG Innovations, and Netscaler Insight.",
        "Improved redundancy through ESXi cluster upgrades across multiple blade chassis and TMG to Netscaler migrations.",
        "Delivered XenDesktop with Netscalers to replace underperforming VMware View in low-bandwidth environments.",
        "Evaluated emerging technologies through POCs: Amazon Workspaces/AppStream 2.0, Azure Citrix deployment, and VDI migration strategies (XenServer, Unidesk, Atlantis ILIO).",
        "Led cloud transformation by migrating traditional Citrix to Citrix Cloud (2019 VDAs, MCS provisioning) and transitioning to AWS CVAD environments.",
        "Optimized operations through PrinterLogic implementation and Citrix ADM deployment for managing multiple ADC HA pairs."
      ],
      responsibilities: [
        "Administration, setup and support of all Xenapp and XenDesktop infrastructure including DDC's, Storefront, Director, Workspace Environment Management, App Layering, MCS and netscalers for a 1000+ concurrent user environment.",
        "Administration, setup and support of windows infrastructure and application servers including AD 2008R2\\2016 and GPO management.",
        "Administration, setup and support of Dell Wyse thinos configurations for the companies call centers with Dell\\Wyse Management Portal."
      ]
    },
    {
      title: "Sr. Systems Engineer",
      company: "RELS",
      location: "Minnetonka, MN",
      period: "2008 - 2011",
      achievements: [
        "Delivered comprehensive Customer Interaction Center VOIP upgrade with virtual and physical server infrastructure deployment.",
        "Enhanced security posture through Symantec Endpoint migration and RSA SecureID 2FA implementation (Cisco ASA, VMware View, hardware/software tokens).",
        "Automated helpdesk operations by implementing AD Manager Plus for streamlined account creation processes.",
        "Modernized infrastructure through Rightfax v9-v10 upgrade and VMware View 4 desktop virtualization deployment."
      ],
      responsibilities: [
        "Managed complete Windows infrastructure stack: AD 2003/2008, Exchange 2003/2010, VMware vSphere, Blackberry Enterprise Server, MS Clustering, SQL databases, RSA SecureID, Rightfax, and Shavlik NetChk Pro patching.",
        "Administered HP Proliant hardware infrastructure (standalone and blade) for production and disaster recovery environments."
      ]
    },
    {
      title: "Master IT Consultant",
      company: "Polaroid Corporation\\Petters Group",
      location: "Minnetonka, MN",
      period: "2005 - 2008",
      achievements: [
        "Architected enterprise legal compliance solution with Symantec Enterprise Vault (Exchange) and Discovery Accelerator for case management.",
        "Orchestrated complex multi-domain migrations using Quest Migration Manager, establishing separate Petters Group domain while integrating Petters Consumer Electronics into Polaroid domain.",
        "Delivered comprehensive DotNetNuke 4 intranet solution with custom themes for multiple business units, including admin training for content management autonomy.",
        "Enabled seamless cross-platform operations by integrating acquired marketing company's Apple Mac infrastructure into Windows Domain environment.",
        "Designed and deployed complete IT infrastructure for new Petters Group organization, including MIIS and Interorg Replication for enhanced inter-company communications."
      ],
      responsibilities: [
        "Managed hybrid infrastructure: Windows (AD 2003, Exchange 2003, Blackberry, IIS, SQL) and Apple Mac 10.5 application servers with comprehensive litigation discovery oversight.",
        "Administered complete network infrastructure: Cisco switches/WAPs, Netscreen firewalls, DMZ, SSL VPN, routing, and internet connectivity with full backup/DR management.",
        "Developed and hosted Petters companies' web applications, ensuring business continuity through comprehensive backup and disaster recovery protocols."
      ]
    },
    {
      title: ".Net Web Application Developer",
      company: "Fingerhut\\Petters Group",
      location: "Minnetonka, MN",
      period: "2002 - 2005",
      achievements: [
        "Redesigned www.fingerhut.com homepage and checkout experience with multiple payment method integration, significantly enhancing user conversion.",
        "Boosted search visibility through comprehensive SEO implementation: dynamic sitemaps and optimized product pages.",
        "Delivered personalized customer experience using Offermatica integration for account lifecycle-based content targeting.",
        "Modernized development operations by migrating from Visual SourceSafe to AccuRev with automated build processes and comprehensive workflow optimization.",
        "Established enterprise deployment automation for web, phone, and mail order applications, plus DotNetNuke intranet implementation and Linkshare affiliate marketing integration."
      ],
      responsibilities: [
        "Developed and maintained www.fingerhut.com using ASP.NET, VB.NET, JavaScript, and SQL while supporting web, customer service, mail, and phone order applications.",
        "Managed enterprise development infrastructure: AccuRev source control, Coremetrics analytics, automated build/deployment processes, performance monitoring, and developer workstation environments."
      ]
    },
    {
      title: "Workstation and Server Systems Administrator",
      company: "Fingerhut",
      location: "Plymouth, MN",
      period: "1998 - 2002",
      achievements: [
        "Rapidly deployed clustered WebLogic infrastructure for www.oldpueblotraders.com eCommerce platform within one month deadline.",
        "Modernized corporate internet access by migrating from Netscape Proxy to ISA 2000/Chaperon 2000, enabling comprehensive access reporting and content filtering capabilities.",
        "Led enterprise OS migration from Windows NT 4 to Windows 2000 across multiple eCommerce properties and automated CCMail-to-Exchange transition using KiX scripting and SMS Installer."
      ],
      responsibilities: [
        "Administered enterprise messaging and application infrastructure: Exchange 5.5/2000, WTS with Citrix MetaFrame, ISA/Chaperon 2000, and IIS servers.",
        "Managed Fingerhut subsidiary websites (figis.com, pcflowers.com, popularclub.com on IIS; oldpueblotraders.com on WebLogic) and automated deployment systems using Ghost, Sysprep, KiX scripting, and SMS.",
        "Delivered enterprise desktop management through automated software deployment, testing/evaluation processes, and third-level support for all Windows-based servers and workstations."
      ]
    },
    {
      title: "IT Consulting",
      company: "Global Financial Group",
      location: "Minneapolis, MN",
      period: "1997 - 2001",
      responsibilities: [
        "Provided comprehensive IT consulting services: NT/2000 server infrastructure (domain, file, print), email servers, web development, and network security (proxy servers, firewalls, modem pooling)."
      ]
    },
    {
      title: "IT Administrator",
      company: "Bonestroo Rosene Anderlik and Associates",
      location: "Roseville, MN",
      period: "1996 - 1998",
      responsibilities: [
        "Administered hybrid infrastructure: NT domain/Exchange 5.5/SQL servers and Novell systems with comprehensive backup/restore operations.",
        "Provided technical support for engineering workstations (MS Office, AutoCAD) and managed complete network infrastructure including printers, phones, and WAN connectivity."
      ]
    },
    {
      title: "Pre Press Technician",
      company: "Print Craft Inc",
      location: "New Brighton, MN",
      period: "1992 - 1996",
      responsibilities: [
        "Advanced through multiple pre-press operations (proofing, plating, stripping) from entry-level press feeder, demonstrating strong technical aptitude and work ethic that led to IT career transition."
      ]
    }
  ]
};
