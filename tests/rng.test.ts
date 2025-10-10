import { describe, expect, it } from 'vitest';
import { RNG, seededRandom } from '../src/utils/rng';

describe('RNG', () => {
  it('produces deterministic sequence', () => {
    const rng1 = new RNG(123);
    const rng2 = new RNG(123);
    const seq1 = [rng1.next(), rng1.next(), rng1.next()];
    const seq2 = [rng2.next(), rng2.next(), rng2.next()];
    expect(seq1).toEqual(seq2);
  });

  it('seededRandom hashes string consistently', () => {
    const rngA = seededRandom('village');
    const rngB = seededRandom('village');
    expect(rngA.next()).toBeCloseTo(rngB.next(), 10);
  });
});
