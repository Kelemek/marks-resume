export function calculateITExperience(startYear: number): number {
  return new Date().getFullYear() - startYear;
}
