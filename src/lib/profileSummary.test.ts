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

    const foundedSentence =
      'Founded Romans 8 Partners, an AI coaching and consulting practice helping small-business owners apply practical AI tools in their day-to-day work.';

    expect(profileSummaryParagraph3).toContain(foundedSentence);
    expect(formatProfileSummaryForAts(years)).toContain(foundedSentence);
  });
});
