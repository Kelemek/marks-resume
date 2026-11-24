import { describe, it, expect } from 'vitest';
import { computeCertImageBox } from './certImageLayout';

describe('computeCertImageBox', () => {
  it('scales landscape images to fill width when height allows', () => {
    const box = computeCertImageBox(2400, 1540, 858, 781);
    expect(box.width).toBe(858);
    expect(box.height).toBe(551);
  });

  it('scales portrait images to fill height when width allows', () => {
    const box = computeCertImageBox(1200, 1600, 400, 500);
    expect(box.height).toBe(500);
    expect(box.width).toBe(375);
  });

  it('does not upscale beyond natural size', () => {
    const box = computeCertImageBox(200, 100, 800, 600);
    expect(box).toEqual({ width: 200, height: 100 });
  });

  it('returns zero box for invalid input', () => {
    expect(computeCertImageBox(0, 100, 100, 100)).toEqual({ width: 0, height: 0 });
    expect(computeCertImageBox(100, 100, 0, 100)).toEqual({ width: 0, height: 0 });
  });
});