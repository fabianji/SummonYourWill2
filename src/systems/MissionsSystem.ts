import type { HeroState } from './HeroesSystem';
import type { MissionData } from '../data/types';
import { EventBus } from '../core/EventBus';
import { seededRandom } from '../utils/rng';

export interface MissionRuntime extends MissionData {
  remainingMinutes: number;
  startedAt?: number;
  successChance: number;
}

export class MissionsSystem {
  private missions: MissionRuntime[] = [];
  private seed = seededRandom('village-missions');
  private onReward?: (rewards: Record<'gold' | 'wood' | 'stone' | 'food', number>) => void;

  hydrate(data: MissionData[]) {
    this.missions = data.map((mission) => ({
      ...mission,
      remainingMinutes: mission.durationMin,
      successChance: this.calculateBaseChance(mission)
    }));
    if (this.missions.length < 3) {
      this.generateMissions(3 - this.missions.length);
    }
    EventBus.emit('missions:updated', undefined);
  }

  setRewardHandler(handler: (rewards: Record<'gold' | 'wood' | 'stone' | 'food', number>) => void) {
    this.onReward = handler;
  }

  getMissions() {
    return this.missions;
  }

  generateMissions(count: number) {
    for (let i = 0; i < count; i++) {
      const id = `mission-${Date.now()}-${Math.floor(this.seed.next() * 1000)}`;
      const difficulty = Math.floor(this.seed.range(1, 6));
      const duration = Math.floor(this.seed.range(3, 12));
      const energyCost = Math.floor(this.seed.range(5, 15));
      const rewards = {
        gold: Math.floor(this.seed.range(15, 60)) * difficulty,
        wood: Math.floor(this.seed.range(0, 10)),
        stone: Math.floor(this.seed.range(0, 10)),
        food: Math.floor(this.seed.range(0, 10))
      };
      const enemies = [{ name: this.seed.pick(['Slime', 'Bandit', 'Goblin', 'Wolf']), power: difficulty * 5 }];
      this.missions.push({
        id,
        title: `Patrol ${this.seed.pick(['Forest', 'Ruins', 'Caves'])}`,
        difficulty,
        durationMin: duration,
        energyCost,
        rewards,
        enemies,
        status: 'available',
        assignedHeroes: [],
        remainingMinutes: duration,
        successChance: this.calculateBaseChance({
          id,
          title: '',
          difficulty,
          durationMin: duration,
          energyCost,
          rewards,
          enemies,
          status: 'available',
          assignedHeroes: []
        })
      });
    }
    EventBus.emit('missions:updated', undefined);
  }

  private calculateBaseChance(mission: MissionData) {
    return Math.min(0.95, 0.5 + mission.difficulty * 0.08);
  }

  assignHeroes(missionId: string, heroes: HeroState[]) {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;
    mission.assignedHeroes = heroes.map((hero) => hero.id);
    mission.successChance = this.calculateSuccessChance(mission, heroes);
    EventBus.emit('missions:updated', undefined);
  }

  startMission(missionId: string, heroes: HeroState[]) {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission || mission.status !== 'available') return false;
    mission.status = 'ongoing';
    mission.startedAt = mission.durationMin;
    mission.remainingMinutes = mission.durationMin;
    mission.successChance = this.calculateSuccessChance(mission, heroes);
    EventBus.emit('missions:updated', undefined);
    EventBus.emit('log:message', `Mission '${mission.title}' started with ${heroes.length} heroes.`);
    return true;
  }

  resolveMission(mission: MissionRuntime, heroes: HeroState[]) {
    const roll = this.seed.next();
    const success = roll <= mission.successChance;
    mission.status = success ? 'completed' : 'failed';
    mission.remainingMinutes = 0;
    EventBus.emit('missions:updated', undefined);
    EventBus.emit('log:message', `Mission '${mission.title}' ${success ? 'succeeded' : 'failed'} (${Math.round(mission.successChance * 100)}% chance).`);
    if (success && this.onReward) {
      this.onReward(mission.rewards);
    }
    return success;
  }

  update(deltaMinutes: number, heroMap: Map<string, HeroState>) {
    if (deltaMinutes <= 0) return;
    for (const mission of this.missions) {
      if (mission.status !== 'ongoing') continue;
      mission.remainingMinutes -= deltaMinutes;
      if (mission.remainingMinutes <= 0) {
        const heroes = mission.assignedHeroes.map((id) => heroMap.get(id)).filter(Boolean) as HeroState[];
        this.resolveMission(mission, heroes);
      }
    }
  }

  calculateSuccessChance(mission: MissionData, heroes: HeroState[]) {
    const totalPower = heroes.reduce((acc, hero) => acc + hero.level * 10 + hero.energy * 0.2, 0);
    const difficultyScore = mission.difficulty * 50;
    const ratio = totalPower / (difficultyScore || 1);
    return Math.max(0.1, Math.min(0.95, 0.45 + ratio * 0.25));
  }
}
