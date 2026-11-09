# Resume page

The resume is one page. A visitor sees Mark Dean Larson’s name, the six section headings, in-page navigation, and the contact and portfolio links.

## Sub-features

- `page-load` shows the name, role line, and a client script that has finished booting.
- `section-headings` shows Profile, Experience, both skill groups, Education, and Contact.
- `page-content` shows at least one job and one skill in each skill grid.
- `nav-anchors` points Profile, Experience, Skills, Education, and Contact at their section ids.
- `nav-portfolio` exposes the portfolio anchor for a new tab.
- `contact-links` exposes email, phone, and the map address.
- `nav-experience` moves the Experience section up under the navbar.

## How to get to it (user POV)

- Open `/` (the only page).
- Choose a section name in the top navigation.
- Choose the name in the navbar to return to the top of the page.

## Driving it with Playwright

Preconditions:

- `launch.sh` and `doctor.sh` succeed.
- The built page includes at least one job and one skill in each grid. An empty Supabase table fails this journey.

- **Load the page.** Open `/`. Run `scripts/verify-marks-resume/drive-page-sections.sh`. The script waits until `#themeToggle` has aria-label `Switch to dark mode` or `Switch to light mode`, the document title is `Mark Dean Larson - Resume`, and the `h1` is `Mark Dean Larson`.
- **Read the hero.** The first paragraph in `#top` contains `Systems Engineer/Frontend Developer` and `Cambridge, Minnesota`. `#hero-experience-years` and `#experience-years` are the same digits. The logo link’s href is `#top`. The hero link `Get in touch` has href `mailto:markdlarson@me.com`. The button `Download Resume` is present (this journey does not click it).
- **Read the sections.** Headings `Professional Profile`, `Professional Experience`, `Systems Software`, `Development Software`, `Education & Certifications`, and `Get in Touch` are visible. `#experience h3`, `#systems-software-grid h4`, and `#development-software-grid h4` each have at least one entry. `#education` contains `Training courses in Exchange 5.5/2000/2010`.
- **Check navigation.** In `navigation`, Profile, Experience, Skills, Education, and Contact point at `#profile`, `#experience`, `#skills`, `#education`, and `#contact`. Portfolio’s href is `https://portfolio.romans8.net`, its target is `_blank`, and its rel includes `noopener` and `noreferrer`.
- **Check contact.** In `#contact`, `markdlarson@me.com` is `mailto:markdlarson@me.com`, `763.355.2923` is `tel:+17633552923`, and the street address is `http://maps.apple.com/?q=2130+Cleveland+Lane+S,+Cambridge,+MN+55008`.
- **Open Experience.** Choose `Experience`. The script clicks that link, the URL ends with `#experience`, and `#experience`’s top is between 0 and 220 pixels (under the fixed navbar).
- **Proof.** The script writes `evidence/page-sections-top.png`, `evidence/page-sections-experience.png`, `evidence/page-sections.aria.txt`, and `evidence/page-sections.txt`. The ARIA snapshot includes `Mark Dean Larson`.

## Gotchas

- `goto` uses `load`, not `networkidle`. The Google Fonts stylesheet can keep the network busy.
- The static HTML aria-label is `Toggle dark/light mode` until the client script runs. Wait for the switched label.
- Portfolio, mailto, tel, and the map link are proved by their attributes. The script does not open those targets.
- Smooth scrolling is on. Wait until `#experience` is near the top; do not assert on a fixed sleep.
- Zero jobs or zero skills fails `page-content`. Do not drop that check to accept an empty build.
- A viewport of 1280×900 shows the nav links. The hamburger is hidden at this width; that is the mobile journey.
