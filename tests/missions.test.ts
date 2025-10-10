import { describe, expect, it, vi } from 'vitest';
import { MissionsSystem } from '../src/systems/MissionsSystem';
import type { HeroState } from '../src/systems/HeroesSystem';

const baseMission = {
  id: 'test',
  title: 'Test Mission',
  difficulty: 2,
  durationMin: 5,
  energyCost: 5,
  rewards: { gold: 10, wood: 0, stone: 0, food: 0 },
  enemies: [{ name: 'Slime', power: 5 }],
  status: 'available' as const,
  assignedHeroes: [] as string[]
};

describe('MissionsSystem', () => {
  it('resolves missions and grants rewards', () => {
    const missions = new MissionsSystem();
    missions.hydrate([baseMission]);
    (missions as any).seed = { next: () => 0 };
    const rewardSpy = vi.fn();
    missions.setRewardHandler(rewardSpy);

    const heroes: HeroState[] = [
      {
        id: 'hero-1',
        name: 'Hero',
        level: 5,
        sex: 'male',
        origin: '',
        professions: [],
        desc: '',
        favorite: false,
        avatar: '',
        energy: 100,
        maxEnergy: 100
      }
    ];

    missions.assignHeroes('test', heroes);
    missions.startMission('test', heroes);
    const mission = missions.getMissions()[0];
    const success = missions.resolveMission(mission, heroes);
    expect(success).toBe(true);
    expect(rewardSpy).toHaveBeenCalledWith(baseMission.rewards);
    expect(mission.status).toBe('completed');
  });
});
