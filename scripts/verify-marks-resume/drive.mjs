import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const feature = process.argv[2];
const baseUrl = process.env.MARKS_RESUME_VERIFY_URL;
const evidenceDir = process.env.EVIDENCE_DIR;

const drives = {
  'page-sections': drivePageSections,
  'theme-toggle': driveThemeToggle,
  'ats-download': driveAtsDownload,
  certificates: driveCertificates,
  'mobile-nav': driveMobileNav,
};

function oneLine(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/\s+/g, ' ').slice(0, 500);
}

function check(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasClass(className, token) {
  return (className ?? '').split(/\s+/).includes(token);
}

async function bootPage(page) {
  await page.goto(`${baseUrl}/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => {
    const label = document.querySelector('#themeToggle')?.getAttribute('aria-label');
    return label === 'Switch to dark mode' || label === 'Switch to light mode';
  });
}

async function newContext(browser, viewport) {
  return browser.newContext({
    viewport,
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  });
}

async function shot(page, lines, name) {
  const file = path.join(evidenceDir, name);
  await page.screenshot({ path: file });
  lines.push(`screenshot=${file}`);
  return file;
}

async function sectionNearTop(page, selector) {
  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const top = el.getBoundingClientRect().top;
    return top >= 0 && top <= 220;
  }, selector);
}

async function drivePageSections(browser, lines) {
  const context = await newContext(browser, { width: 1280, height: 900 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await bootPage(page);

  await page.getByRole('heading', { level: 1, name: 'Mark Dean Larson' }).waitFor();
  check((await page.title()) === 'Mark Dean Larson - Resume', `title was ${await page.title()}`);

  const logo = page.getByRole('link', { name: 'Mark Dean Larson', exact: true });
  check((await logo.getAttribute('href')) === '#top', 'logo href is not #top');

  const roleLine = await page.locator('#top p').first().innerText();
  check(roleLine.includes('Systems Engineer/Frontend Developer'), 'hero role line missing');
  check(roleLine.includes('Cambridge, Minnesota'), 'hero location missing');
  const heroYears = (await page.locator('#hero-experience-years').innerText()).trim();
  const profileYears = (await page.locator('#experience-years').innerText()).trim();
  check(/^\d+$/.test(heroYears), `hero years were ${heroYears}`);
  check(heroYears === profileYears, `hero years ${heroYears} != profile years ${profileYears}`);
  lines.push(`experience_years=${heroYears}`);

  const headings = [
    'Professional Profile',
    'Professional Experience',
    'Systems Software',
    'Development Software',
    'Education & Certifications',
    'Get in Touch',
  ];
  for (const name of headings) {
    await page.getByRole('heading', { name, exact: true }).waitFor();
  }

  const nav = [
    ['Profile', '#profile'],
    ['Experience', '#experience'],
    ['Skills', '#skills'],
    ['Education', '#education'],
    ['Contact', '#contact'],
  ];
  for (const [name, href] of nav) {
    const link = page.getByRole('navigation').getByRole('link', { name, exact: true });
    check((await link.getAttribute('href')) === href, `${name} href was ${await link.getAttribute('href')}`);
  }

  const portfolio = page.getByRole('navigation').getByRole('link', { name: 'Portfolio', exact: true });
  check((await portfolio.getAttribute('href')) === 'https://portfolio.romans8.net', 'portfolio href mismatch');
  check((await portfolio.getAttribute('target')) === '_blank', 'portfolio target is not _blank');
  const rel = await portfolio.getAttribute('rel');
  check(rel?.includes('noopener') && rel.includes('noreferrer'), `portfolio rel was ${rel}`);

  const heroMail = page.locator('#top').getByRole('link', { name: 'Get in touch', exact: true });
  check((await heroMail.getAttribute('href')) === 'mailto:markdlarson@me.com', 'hero mailto mismatch');
  await page.getByRole('button', { name: 'Download Resume', exact: true }).waitFor();

  const contact = page.locator('#contact');
  const email = contact.getByRole('link', { name: 'markdlarson@me.com', exact: true });
  const phone = contact.getByRole('link', { name: '763.355.2923', exact: true });
  const address = contact.getByRole('link', {
    name: '2130 Cleveland Lane S, Cambridge, MN 55008',
    exact: true,
  });
  check((await email.getAttribute('href')) === 'mailto:markdlarson@me.com', 'contact mailto mismatch');
  check((await phone.getAttribute('href')) === 'tel:+17633552923', 'contact tel mismatch');
  check(
    (await address.getAttribute('href')) === 'http://maps.apple.com/?q=2130+Cleveland+Lane+S,+Cambridge,+MN+55008',
    'maps href mismatch',
  );

  const training = await page.locator('#education').innerText();
  check(
    training.includes('Training courses in Exchange 5.5/2000/2010'),
    'professional training copy missing',
  );

  const jobs = await page.locator('#experience h3').count();
  const systems = await page.locator('#systems-software-grid h4').count();
  const development = await page.locator('#development-software-grid h4').count();
  check(jobs >= 1, 'no job titles rendered');
  check(systems >= 1, 'no systems skills rendered');
  check(development >= 1, 'no development skills rendered');
  lines.push(`jobs=${jobs}`);
  lines.push(`systems_skills=${systems}`);
  lines.push(`development_skills=${development}`);

  await shot(page, lines, 'page-sections-top.png');
  const aria = await page.locator('body').ariaSnapshot();
  const ariaPath = path.join(evidenceDir, 'page-sections.aria.txt');
  await writeFile(ariaPath, aria);
  lines.push(`aria=${ariaPath}`);
  check(aria.includes('Mark Dean Larson'), 'ARIA snapshot missing the name');

  await page.getByRole('navigation').getByRole('link', { name: 'Experience', exact: true }).click();
  await page.waitForURL(/#experience$/);
  await sectionNearTop(page, '#experience');
  await shot(page, lines, 'page-sections-experience.png');
  lines.push('clicked=Experience');
  lines.push(`result_url=${page.url()}`);
  return page;
}

async function driveThemeToggle(browser, lines) {
  const context = await newContext(browser, { width: 1280, height: 900 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await bootPage(page);

  const toggle = page.locator('#themeToggle');
  const label = page.locator('.theme-text');
  check((await toggle.getAttribute('aria-label')) === 'Switch to dark mode', 'initial aria-label was not Switch to dark mode');
  check((await label.innerText()).trim() === 'Dark Mode', 'initial button text was not Dark Mode');
  check((await page.locator('body').getAttribute('data-theme')) === 'light', 'initial data-theme was not light');
  await shot(page, lines, 'theme-toggle-light.png');

  await toggle.click();
  await page.waitForFunction(() => document.body.getAttribute('data-theme') === 'dark');
  check((await toggle.getAttribute('aria-label')) === 'Switch to light mode', 'aria-label did not switch');
  check((await label.innerText()).trim() === 'Light Mode', 'button text did not switch');
  check((await page.evaluate(() => localStorage.getItem('theme'))) === 'dark', 'localStorage theme was not dark');
  await shot(page, lines, 'theme-toggle-dark.png');

  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => document.body.getAttribute('data-theme') === 'dark');
  check((await page.locator('.theme-text').innerText()).trim() === 'Light Mode', 'theme did not persist across reload');
  await shot(page, lines, 'theme-toggle-persisted.png');
  lines.push('persisted=dark');
  return page;
}

async function driveAtsDownload(browser, lines) {
  const context = await newContext(browser, { width: 1280, height: 900 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await bootPage(page);
  await page.waitForFunction(() => window.atsResumeData && window.atsResumeData.itStartYear);

  const jobTitle = (await page.locator('#experience h3').first().innerText()).trim();
  check(jobTitle.length > 0, 'no job title to compare with the download');
  lines.push(`job_title=${jobTitle}`);

  const button = page.getByRole('button', { name: 'Download Resume', exact: true });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    button.click(),
  ]);
  const filename = download.suggestedFilename();
  check(filename === 'Mark_Dean_Larson_Resume_ATS.txt', `filename was ${filename}`);
  const saved = path.join(evidenceDir, filename);
  await download.saveAs(saved);
  const text = await readFile(saved, 'utf8');
  check(text.includes('MARK LARSON'), 'download missing MARK LARSON');
  check(text.includes('markdlarson@me.com'), 'download missing email');
  check(text.includes('763.355.2923'), 'download missing phone');
  check(text.includes('PROFESSIONAL SUMMARY'), 'download missing summary section');
  check(text.includes('PROFESSIONAL EXPERIENCE'), 'download missing experience section');
  check(text.includes(jobTitle), `download missing rendered job ${jobTitle}`);
  await page.waitForFunction(() => {
    const el = document.querySelector('#downloadPDF');
    return el && !el.disabled && el.textContent === 'Download Resume';
  });
  lines.push(`download=${saved}`);
  lines.push(`download_bytes=${Buffer.byteLength(text)}`);
  await shot(page, lines, 'ats-download.png');
  return page;
}

function isRaster(src) {
  return /\.(jpe?g|png|webp|gif|svg)(\?|$)/i.test(src);
}

async function openCertificate(page, src) {
  if (isRaster(src)) {
    await page.waitForFunction((expected) => {
      const modal = document.querySelector('#certModal');
      const img = document.querySelector('#certImage');
      const frame = document.querySelector('#certViewer');
      return modal?.style.display === 'block'
        && img?.style.display === 'block'
        && img.src === expected
        && img.complete
        && img.naturalWidth > 0
        && frame?.style.display === 'none';
    }, src, { timeout: 20000 });
    return 'image';
  }
  await page.waitForFunction((expected) => {
    const modal = document.querySelector('#certModal');
    const img = document.querySelector('#certImage');
    const frame = document.querySelector('#certViewer');
    return modal?.style.display === 'block'
      && frame?.style.display === 'block'
      && typeof frame.src === 'string'
      && frame.src.startsWith(expected)
      && img?.style.display === 'none';
  }, src, { timeout: 20000 });
  return 'pdf';
}

async function certificateClosed(page) {
  await page.waitForFunction(() => {
    const modal = document.querySelector('#certModal');
    const img = document.querySelector('#certImage');
    const frame = document.querySelector('#certViewer');
    return modal?.style.display === 'none'
      && img?.style.display === 'none'
      && frame?.style.display === 'none';
  });
}

async function driveCertificates(browser, lines) {
  const context = await newContext(browser, { width: 1280, height: 900 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await bootPage(page);

  await page.getByRole('heading', { name: 'Education & Certifications', exact: true }).waitFor();
  const toggle = page.locator('#scrimbaStackToggle');
  check((await toggle.getAttribute('aria-expanded')) === 'false', 'scrimba toggle did not start collapsed');
  check(!hasClass(await page.locator('#scrimbaStack').getAttribute('class'), 'expanded'), 'scrimba stack started expanded');
  const toggleText = await toggle.innerText();
  const countMatch = toggleText.match(/Scrimba Certificates \((\d+)\)/);
  check(countMatch !== null, `scrimba toggle text was ${toggleText}`);
  const scrimbaCount = Number(countMatch[1]);
  lines.push(`scrimba_count=${scrimbaCount}`);
  await shot(page, lines, 'certificates-collapsed.png');

  await toggle.click();
  await page.waitForFunction(() => document.querySelector('#scrimbaStackToggle')?.getAttribute('aria-expanded') === 'true');
  check(hasClass(await page.locator('#scrimbaStack').getAttribute('class'), 'expanded'), 'scrimba stack did not expand');
  const nestedTitles = await page.locator('#scrimbaStackPanel h3').count();
  check(nestedTitles === scrimbaCount, `scrimba panel had ${nestedTitles} titles, label said ${scrimbaCount}`);
  await shot(page, lines, 'certificates-expanded.png');

  const view = page.locator('#education-grid > div:not(.stacked-card-container) .cert-button');
  const viewCount = await view.count();
  if (viewCount < 1) {
    throw new Error('unmet precondition: no education certificate View button (none of those cards has a pdfPath)');
  }
  const button = view.first();
  const src = await button.getAttribute('data-cert');
  const aria = await button.getAttribute('aria-label');
  check(typeof src === 'string' && src.length > 0, 'View button has no data-cert');
  check(typeof aria === 'string' && aria.length > 0, 'View button has no aria-label');
  lines.push(`cert_aria=${aria}`);
  lines.push(`cert_src=${src}`);
  await button.click();
  const kind = await openCertificate(page, src);
  lines.push(`cert_viewer=${kind}`);
  await shot(page, lines, 'certificates-modal.png');

  await page.locator('#certModal .close').click();
  await certificateClosed(page);
  lines.push('closed=click');

  await button.click();
  await openCertificate(page, src);
  await page.keyboard.press('Escape');
  await certificateClosed(page);
  lines.push('closed=escape');
  await shot(page, lines, 'certificates-closed.png');
  return page;
}

async function driveMobileNav(browser, lines) {
  const context = await newContext(browser, { width: 390, height: 844 });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await bootPage(page);

  const hamburger = page.getByRole('button', { name: 'Toggle navigation menu', exact: true });
  await hamburger.waitFor();
  const profile = page.locator('#navLinks').getByRole('link', { name: 'Profile', exact: true });
  check(await hamburger.isVisible(), 'hamburger is not visible at 390px');
  check(!(await profile.isVisible()), 'nav links are visible before the menu opens');
  check(await page.locator('#scrollToTop').getAttribute('hidden') !== null, 'scroll-to-top was visible at the top');
  await shot(page, lines, 'mobile-nav-closed.png');

  await hamburger.click();
  await page.waitForFunction(() => document.querySelector('#navLinks')?.classList.contains('active'));
  check(hasClass(await hamburger.getAttribute('class'), 'active'), 'hamburger did not receive active');
  check(await profile.isVisible(), 'Profile link stayed hidden after opening the menu');
  await shot(page, lines, 'mobile-nav-open.png');

  await profile.click();
  await page.waitForURL(/#profile$/);
  await page.waitForFunction(() => !document.querySelector('#navLinks')?.classList.contains('active'));
  check(!(await profile.isVisible()), 'menu stayed open after choosing Profile');
  lines.push(`result_url=${page.url()}`);

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForFunction(() => window.scrollY > 320);
  const topButton = page.getByRole('button', { name: 'Scroll to top', exact: true });
  await topButton.waitFor({ state: 'visible' });
  await shot(page, lines, 'mobile-nav-scrolled.png');
  await topButton.click();
  await sectionNearTop(page, '#top');
  await page.waitForFunction(() => document.querySelector('#scrollToTop')?.hasAttribute('hidden'));
  await shot(page, lines, 'mobile-nav-top.png');
  lines.push('scroll_to_top=hidden');
  return page;
}

async function main() {
  if (!baseUrl || !evidenceDir) {
    console.error('[drive] MARKS_RESUME_VERIFY_URL and EVIDENCE_DIR are required. Use the drive-*.sh wrappers.');
    process.exit(1);
  }
  const run = drives[feature];
  if (!run) {
    console.error(`[drive] Unknown feature "${feature}". Expected one of: ${Object.keys(drives).join(', ')}`);
    process.exit(2);
  }

  await mkdir(evidenceDir, { recursive: true });
  const lines = [`feature=${feature}`, `url=${baseUrl}/`];
  const browser = await chromium.launch({ headless: true });
  let page;
  let failed = false;
  try {
    page = await run(browser, lines);
  } catch (error) {
    failed = true;
    lines.push(`error=${oneLine(error)}`);
    if (page) {
      const failureShot = path.join(evidenceDir, `${feature}-failure.png`);
      await page.screenshot({ path: failureShot }).catch(() => {});
      lines.push(`failure_screenshot=${failureShot}`);
    }
  } finally {
    await browser.close();
  }

  lines.push(`status=${failed ? 'failed' : 'ok'}`);
  const transcript = path.join(evidenceDir, `${feature}.txt`);
  await writeFile(transcript, `${lines.join('\n')}\n`);
  if (failed) {
    console.error(`[drive-${feature}] Failed. See ${transcript}`);
    process.exit(1);
  }
  console.log(`[drive-${feature}] Wrote ${transcript}`);
}

await main();
