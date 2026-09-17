import { describe, it, expect } from 'vitest';
import { calculateITExperience } from './experience';

describe('calculateITExperience', () => {
  it('returns correct years based on start year', () => {
    const currentYear = new Date().getFullYear();
    expect(calculateITExperience(currentYear)).toBe(0);
    expect(calculateITExperience(currentYear - 5)).toBe(5);
    expect(calculateITExperience(currentYear - 30)).toBe(30);
  });
});
