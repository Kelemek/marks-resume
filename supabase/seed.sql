-- =============================================
-- Seed Data for Resume Database
-- Run this AFTER schema.sql
-- =============================================

-- =============================================
-- Clear existing data first
-- =============================================
DELETE FROM skills;
DELETE FROM certificates;
DELETE FROM jobs;
DELETE FROM settings;

-- =============================================
-- Settings
-- =============================================
INSERT INTO settings (key, value) VALUES
  ('it_start_year', '1996');

-- =============================================
-- Systems Software Skills
-- =============================================
INSERT INTO skills (name, years, category, sort_order) VALUES
  ('Windows NT 3.5 - 2025', '29 years', 'systems', 1),
  ('VMWare ESX/ESXi 3.5 - 8', '16 years', 'systems', 2),
  ('Active Directory', '20 years', 'systems', 3),
  ('Citrix Apps & Desktops', '10 years', 'systems', 4),
  ('Exchange 5.5 - 2010', '10 years', 'systems', 5),
  ('Citrix Netscaler/ADC 9 - 12', '10 years', 'systems', 6),
  ('Apple MacOS 10.4 - 26', '10 years', 'systems', 7),
  ('SQL Server 6.5 - 2019', '10 years', 'systems', 8),
  ('Azure SQL', '2 years', 'systems', 9),
  ('IIS 3 - 7', '9 years', 'systems', 10),
  ('VBScript', '8 years', 'systems', 11),
  ('ControlUP', '6 years', 'systems', 12);

-- =============================================
-- Development Software Skills
-- =============================================
INSERT INTO skills (name, years, category, sort_order) VALUES
  ('Visual Studio', '4 years', 'development', 1),
  ('VS Code', '2 years', 'development', 2),
  ('ASP.net', '4 years', 'development', 3),
  ('VB.net', '4 years', 'development', 4),
  ('React', '1 year', 'development', 5),
  ('Next.JS', '1 year', 'development', 6),
  ('Supabase', '1 year', 'development', 7),
  ('CSS', '1 year', 'development', 8),
  ('TypeScript', '1 year', 'development', 9),
  ('JavaScript', '2 years', 'development', 10),
  ('Transact SQL', '2 years', 'development', 11),
  ('HTML', '2 years', 'development', 12),
  ('Powershell', '3 years', 'development', 13),
  ('Node.js', '1 year', 'development', 14),
  ('Github', '2 years', 'development', 15);

-- =============================================
-- Education Certificates
-- =============================================
INSERT INTO certificates (title, institution, pdf_path, aria_label, category, sort_order) VALUES
  ('Brown Institute', 'Advertising Design - 1995', NULL, NULL, 'education', 1),
  ('School of Communication Arts', 'Computer Animation - 1995', NULL, NULL, 'education', 2),
  ('Microsoft Certified Professional', 'Workstation, Server Enterprise - 1999', NULL, NULL, 'education', 3),
  ('AZ 900 Certificate', 'Azure Fundamentals - 2024', 'img/Credentials AZ900 - marklarson-7761 | Microsoft Learn.pdf', 'View AZ900 Certificate', 'education', 4),
  ('PL 900 Certificate', 'Power Platform Fundamentals - 2025', 'img/Credentials PL900 - marklarson-7761 | Microsoft Learn.pdf', 'View PL900 Certificate', 'education', 5),
  ('Association of Certified Biblical Counselors', 'ACBC Certificate - 2024', 'img/ACBC Certificate.pdf', 'View Biblical Counseling Certificate', 'education', 6);

-- =============================================
-- Scrimba Certificates
-- =============================================
INSERT INTO certificates (title, institution, pdf_path, aria_label, category, sort_order) VALUES
  ('Javascript', 'Scrimba Certificate - 2025', 'img/Learn Javascript.pdf', 'View Javascript Certificate', 'scrimba', 1),
  ('HTML and CSS', 'Scrimba Certificate - 2025', 'img/Learn HTML and CSS.pdf', 'View HTML and CSS Certificate', 'scrimba', 2),
  ('Learn Tailwind CSS', 'Scrimba Certificate - 2025', 'img/Learn Tailwind CSS.pdf', 'View Learn Tailwind CSS Certificate', 'scrimba', 3),
  ('Learn CSS Variables', 'Scrimba Certificate - 2025', 'img/CSS Variables Tutorial - Learn CSS variables in this free course.pdf', 'View CSS Variables Certificate', 'scrimba', 4),
  ('React', 'Scrimba Certificate - 2025', 'img/Learn React.pdf', 'View React Certificate', 'scrimba', 5),
  ('Learn Typescript', 'Scrimba Certificate - 2025', 'img/Learn Typescript.pdf', 'View Learn Typescript Certificate', 'scrimba', 6),
  ('Intro to Supabase', 'Scrimba Certificate - 2025', 'img/Intro to Supabase.pdf', 'View Intro to Supabase Certificate', 'scrimba', 7),
  ('Intro to SQL', 'Scrimba Certificate - 2025', 'img/Intro to SQL.pdf', 'View Intro to SQL Certificate', 'scrimba', 8),
  ('Node.js', 'Scrimba Certificate - 2025', 'img/Learn Node.js.pdf', 'View Node.js Certificate', 'scrimba', 9),
  ('Learn Express.js', 'Scrimba Certificate - 2025', 'img/Learn Express.js.pdf', 'View Express.js Certificate', 'scrimba', 10),
  ('Learn Next.js', 'Scrimba Certificate - 2025', 'img/Learn Next.js.pdf', 'View Learn Next.js', 'scrimba', 11),
  ('Intro to Model Context Protocol (MCP)', 'Scrimba Certificate - 2025', 'img/Intro to Model Context Protocol (MCP).pdf', 'View Intro to Model Context Protocol (MCP)', 'scrimba', 12),
  ('Intro to AI Engineering', 'Scrimba Certificate - 2025', 'img/Intro to AI Engineering.pdf', 'View Intro to AI Engineering Certificate', 'scrimba', 13),
  ('Learn RAG', 'Scrimba Certificate - 2025', 'img/Learn RAG.pdf', 'View Learn RAG Certificate', 'scrimba', 14),
  ('Learn AI Agents', 'Scrimba Certificate - 2025', 'img/Learn AI Agents.pdf', 'View Learn AI Agents Certificate', 'scrimba', 15),
  ('Intro to Vite', 'Scrimba Certificate - 2025', 'img/Intro to Vite.pdf', 'View Intro to Vite Certificate', 'scrimba', 16),
  ('Deploying with Netlify', 'Scrimba Certificate - 2025', 'img/Deploying with Netlify.pdf', 'View Netlify Certificate', 'scrimba', 17),
  ('Accessible Web Design', 'Scrimba Certificate - 2025', 'img/Learn Web Accessibility_ Free interactive course.pdf', 'View Web Accessibility Certificate', 'scrimba', 18),
  ('UI Design Fundamentals', 'Scrimba Certificate - 2025', 'img/UI design fundamentals tutorial_ Learn to create beautiful and functional user interfaces in this free course.pdf', 'View UI Design Certificate', 'scrimba', 19),
  ('Prompt Engineering for Web dev', 'Scrimba Certificate - 2025', 'img/Prompt Engineering for Web dev.pdf', 'View Prompt Engineering for Web dev', 'scrimba', 20),
  ('Learn Vue.js', 'Scrimba Certificate - 2025', 'img/Learn Vue.pdf', 'View Learn Vue.js', 'scrimba', 21),
  ('Learn Bootstrap', 'Scrimba Certificate - 2025', 'img/Learn Bootstrap 4 in this hands-on course.pdf', 'View Learn Bootstrap', 'scrimba', 22),
  ('Learn Advanced React', 'Scrimba Certificate - 2025', 'img/Tutorial_ Learn Advanced React – A 13-hour interactive course lead by Bob Ziroll.pdf', 'View Learn Advanced React', 'scrimba', 23),
  ('Unit Testing Tutorial', 'Scrimba Certificate - 2025', 'img/Unit Testing Tutorial.pdf', 'View Unit Testing Tutorial', 'scrimba', 24),
  ('Intro to Astro', 'Scrimba Certificate - 2025', 'img/Intro to Astro.pdf', 'View Intro to Astro', 'scrimba', 25),
  ('Svelte JS Tutorial', 'Scrimba Certificate - 2025', 'img/Svelte JS Tutorial.pdf', 'View Svelte JS Tutorial', 'scrimba', 26),
  ('ChatGPT Tutorial for Programming', 'Scrimba Certificate - 2025', 'img/ChatGPT Tutorial for Programming.pdf', 'View ChatGPT Tutorial for Programming', 'scrimba', 27),
  ('Clean Code Tutorial', 'Scrimba Certificate - 2025', 'img/Clean Code Tutorial.pdf', 'View Clean Code Tutorial', 'scrimba', 28),
  ('Frontend Developer Path', 'Scrimba Certificate - 2025', 'img/The Front-End Developer Career Path_ Learn the skills you''ll need to launch your career in web development.pdf', 'View Front-End Developer Certificate', 'scrimba', 29),
  ('Full Stack Developer Path', 'Scrimba Certificate - 2025', 'img/The Fullstack Developer Path.pdf', 'View Full Stack Developer Path', 'scrimba', 30),
  ('The AI Engeneer Path', 'Scrimba Certificate - 2025', 'img/The AI Engineer Path_ Learn to Build generative AI-powered apps and advance your web development skills.pdf', 'View The AI Engeneer Path', 'scrimba', 31),
  ('The Backend Developter Path', 'Scrimba Certificate - 2025', 'img/The Backend Developer Path.pdf', 'View The Backend Developer Path', 'scrimba', 32);

-- =============================================
-- Jobs
-- =============================================
INSERT INTO jobs (title, company, location, period, achievements, responsibilities, sort_order) VALUES
  (
    'Systems Engineer II',
    'Mercy Ships',
    'Lindale, TX',
    'June 2023 - Present',
    ARRAY[
      'Setup and tested a POC of the Action1 product for software distribution and patching of the server environment.',
      'Implemented Action1 to replace Microsoft WSUS for OS and third party patching of the server environment.',
      'Upgraded all Microsoft SQL servers to version 2019 and standardized the patching process with Action1.',
      'Upgraded all Windows 2012 servers to Windows 2019 and 2022.',
      'Vulnerability management across the Windows server environment.'
    ],
    ARRAY[
      'Administration setup and support of all server infrastructure spanning across two hospital ships and the headquarters.',
      'Administration setup and support of all VMware vSphere infrastructure.',
      'Administration setup and support of all Azure infrastructure in both US east and France regions.',
      'Administration setup and support of all Microsoft SQL servers.',
      'Administration setup and support of all Windows infrastructure and application servers including AD and GPO management.'
    ],
    1
  ),
  (
    'Sr. Systems Architect',
    'Sonata Software',
    'Eden Prairie, MN',
    '2023 - June 2023',
    ARRAY[]::TEXT[],
    ARRAY[
      'Continued providing enterprise Citrix and virtualization expertise to Bluestem Brands through outsourcing transition, maintaining seamless operations during organizational change.'
    ],
    2
  ),
  (
    'Sr. Systems Architect',
    'Bluestem Brands',
    'Eden Prairie, MN',
    '2011 - 2023',
    ARRAY[
      'Orchestrated comprehensive Citrix infrastructure evolution from Windows 2008R2 to 2022 using App Layering (70+ app layers, 2 platform layers) and full stack upgrades (DDC, Storefront, Director, PVS, WEM, Netscalers).',
      'Achieved 20% memory savings across 50-server XenApp farm through Citrix Workspace Environment Management implementation.',
      'Architected secure PCI-compliant XenApp environment and deployed enterprise Lastpass with Azure AD federation.',
      'Modernized infrastructure by migrating thin clients (HP to Dell/Wyse), VPN (Juniper to Netscaler), and profiles (UPM to FSLogix).',
      'Enhanced monitoring capabilities with comprehensive suite: VMTurbo, ControlUP, Edgesight, EG Innovations, and Netscaler Insight.',
      'Improved redundancy through ESXi cluster upgrades across multiple blade chassis and TMG to Netscaler migrations.',
      'Delivered XenDesktop with Netscalers to replace underperforming VMware View in low-bandwidth environments.',
      'Evaluated emerging technologies through POCs: Amazon Workspaces/AppStream 2.0, Azure Citrix deployment, and VDI migration strategies (XenServer, Unidesk, Atlantis ILIO).',
      'Led cloud transformation by migrating traditional Citrix to Citrix Cloud (2019 VDAs, MCS provisioning) and transitioning to AWS CVAD environments.',
      'Optimized operations through PrinterLogic implementation and Citrix ADM deployment for managing multiple ADC HA pairs.'
    ],
    ARRAY[
      'Administration, setup and support of all Xenapp and XenDesktop infrastructure including DDC''s, Storefront, Director, Workspace Environment Management, App Layering, MCS and netscalers for a 1000+ concurrent user environment.',
      'Administration, setup and support of windows infrastructure and application servers including AD 2008R2\2016 and GPO management.',
      'Administration, setup and support of Dell Wyse thinos configurations for the companies call centers with Dell\Wyse Management Portal.'
    ],
    3
  ),
  (
    'Sr. Systems Engineer',
    'RELS',
    'Minnetonka, MN',
    '2008 - 2011',
    ARRAY[
      'Delivered comprehensive Customer Interaction Center VOIP upgrade with virtual and physical server infrastructure deployment.',
      'Enhanced security posture through Symantec Endpoint migration and RSA SecureID 2FA implementation (Cisco ASA, VMware View, hardware/software tokens).',
      'Automated helpdesk operations by implementing AD Manager Plus for streamlined account creation processes.',
      'Modernized infrastructure through Rightfax v9-v10 upgrade and VMware View 4 desktop virtualization deployment.'
    ],
    ARRAY[
      'Managed complete Windows infrastructure stack: AD 2003/2008, Exchange 2003/2010, VMware vSphere, Blackberry Enterprise Server, MS Clustering, SQL databases, RSA SecureID, Rightfax, and Shavlik NetChk Pro patching.',
      'Administered HP Proliant hardware infrastructure (standalone and blade) for production and disaster recovery environments.'
    ],
    4
  ),
  (
    'Master IT Consultant',
    'Polaroid Corporation\Petters Group',
    'Minnetonka, MN',
    '2005 - 2008',
    ARRAY[
      'Architected enterprise legal compliance solution with Symantec Enterprise Vault (Exchange) and Discovery Accelerator for case management.',
      'Orchestrated complex multi-domain migrations using Quest Migration Manager, establishing separate Petters Group domain while integrating Petters Consumer Electronics into Polaroid domain.',
      'Delivered comprehensive DotNetNuke 4 intranet solution with custom themes for multiple business units, including admin training for content management autonomy.',
      'Enabled seamless cross-platform operations by integrating acquired marketing company''s Apple Mac infrastructure into Windows Domain environment.',
      'Designed and deployed complete IT infrastructure for new Petters Group organization, including MIIS and Interorg Replication for enhanced inter-company communications.'
    ],
    ARRAY[
      'Managed hybrid infrastructure: Windows (AD 2003, Exchange 2003, Blackberry, IIS, SQL) and Apple Mac 10.5 application servers with comprehensive litigation discovery oversight.',
      'Administered complete network infrastructure: Cisco switches/WAPs, Netscreen firewalls, DMZ, SSL VPN, routing, and internet connectivity with full backup/DR management.',
      'Developed and hosted Petters companies'' web applications, ensuring business continuity through comprehensive backup and disaster recovery protocols.'
    ],
    5
  ),
  (
    '.Net Web Application Developer',
    'Fingerhut\Petters Group',
    'Minnetonka, MN',
    '2002 - 2005',
    ARRAY[
      'Redesigned www.fingerhut.com homepage and checkout experience with multiple payment method integration, significantly enhancing user conversion.',
      'Boosted search visibility through comprehensive SEO implementation: dynamic sitemaps and optimized product pages.',
      'Delivered personalized customer experience using Offermatica integration for account lifecycle-based content targeting.',
      'Modernized development operations by migrating from Visual SourceSafe to AccuRev with automated build processes and comprehensive workflow optimization.',
      'Established enterprise deployment automation for web, phone, and mail order applications, plus DotNetNuke intranet implementation and Linkshare affiliate marketing integration.'
    ],
    ARRAY[
      'Developed and maintained www.fingerhut.com using ASP.NET, VB.NET, JavaScript, and SQL while supporting web, customer service, mail, and phone order applications.',
      'Managed enterprise development infrastructure: AccuRev source control, Coremetrics analytics, automated build/deployment processes, performance monitoring, and developer workstation environments.'
    ],
    6
  ),
  (
    'Workstation and Server Systems Administrator',
    'Fingerhut',
    'Plymouth, MN',
    '1998 - 2002',
    ARRAY[
      'Rapidly deployed clustered WebLogic infrastructure for www.oldpueblotraders.com eCommerce platform within one month deadline.',
      'Modernized corporate internet access by migrating from Netscape Proxy to ISA 2000/Chaperon 2000, enabling comprehensive access reporting and content filtering capabilities.',
      'Led enterprise OS migration from Windows NT 4 to Windows 2000 across multiple eCommerce properties and automated CCMail-to-Exchange transition using KiX scripting and SMS Installer.'
    ],
    ARRAY[
      'Administered enterprise messaging and application infrastructure: Exchange 5.5/2000, WTS with Citrix MetaFrame, ISA/Chaperon 2000, and IIS servers.',
      'Managed Fingerhut subsidiary websites (figis.com, pcflowers.com, popularclub.com on IIS; oldpueblotraders.com on WebLogic) and automated deployment systems using Ghost, Sysprep, KiX scripting, and SMS.',
      'Delivered enterprise desktop management through automated software deployment, testing/evaluation processes, and third-level support for all Windows-based servers and workstations.'
    ],
    7
  ),
  (
    'IT Consulting',
    'Global Financial Group',
    'Minneapolis, MN',
    '1997 - 2001',
    ARRAY[]::TEXT[],
    ARRAY[
      'Provided comprehensive IT consulting services: NT/2000 server infrastructure (domain, file, print), email servers, web development, and network security (proxy servers, firewalls, modem pooling).'
    ],
    8
  ),
  (
    'IT Administrator',
    'Bonestroo Rosene Anderlik and Associates',
    'Roseville, MN',
    '1996 - 1998',
    ARRAY[]::TEXT[],
    ARRAY[
      'Administered hybrid infrastructure: NT domain/Exchange 5.5/SQL servers and Novell systems with comprehensive backup/restore operations.',
      'Provided technical support for engineering workstations (MS Office, AutoCAD) and managed complete network infrastructure including printers, phones, and WAN connectivity.'
    ],
    9
  ),
  (
    'Pre Press Technician',
    'Print Craft Inc',
    'New Brighton, MN',
    '1992 - 1996',
    ARRAY[]::TEXT[],
    ARRAY[
      'Advanced through multiple pre-press operations (proofing, plating, stripping) from entry-level press feeder, demonstrating strong technical aptitude and work ethic that led to IT career transition.'
    ],
    10
  );
