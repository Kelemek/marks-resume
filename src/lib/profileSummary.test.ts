import { describe, it, expect } from 'vitest';
import {
  formatProfileSummaryForAts,
  formatProfileSummaryLeadPlain,
  profileSummaryLead,
  profileSummaryParagraph2,
  profileSummaryParagraph3,
} from './profileSummary';

describe('profileSummary', () => {
  it('formats lead paragraph consistently for ATS and profile copy', () => {
    const years = 30;
    const lead = formatProfileSummaryLeadPlain(years);

    expect(lead).toBe(
      `${profileSummaryLead.beforeYears}${years}+${profileSummaryLead.afterYears}`,
    );
    expect(formatProfileSummaryForAts(years)).toContain(lead);
    expect(formatProfileSummaryForAts(years)).toContain(profileSummaryParagraph2);
    expect(formatProfileSummaryForAts(years)).toContain(profileSummaryParagraph3);
  });
});
