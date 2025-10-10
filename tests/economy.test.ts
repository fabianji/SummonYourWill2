import { describe, expect, it } from 'vitest';
import { Economy } from '../src/core/Economy';
import type { VillageData } from '../src/data/types';

describe('Economy', () => {
  it('produces resources over minutes with night bonus', () => {
    const village: VillageData = {
      resources: { gold: 0, stone: 0, wood: 0, food: 0 },
      buildings: [
        { id: 'townhall', level: 1, prodPerMinute: { gold: 2 } },
        { id: 'farm', level: 1, prodPerMinute: { food: 1 } }
      ]
    };
    const economy = new Economy(village);
    economy.tick(1, true);
    expect(village.resources.gold).toBeGreaterThan(0);
    const dayGold = village.resources.gold;
    economy.tick(2, false);
    expect(village.resources.gold).toBeGreaterThan(dayGold);
  });

  it('spends resources when available', () => {
    const village: VillageData = {
      resources: { gold: 100, stone: 0, wood: 0, food: 0 },
      buildings: []
    };
    const economy = new Economy(village);
    expect(economy.spend({ gold: 40 })).toBe(true);
    expect(village.resources.gold).toBeCloseTo(60);
    expect(economy.spend({ gold: 1000 })).toBe(false);
  });
});
