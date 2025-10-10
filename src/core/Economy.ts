import { EventBus } from './EventBus';
import type { ResourceType, VillageData } from '../data/types';

export class Economy {
  private lastMinute = 0;

  constructor(private village: VillageData) {}

  tick(currentMinute: number, isDay: boolean) {
    if (!this.village) return;
    if (Math.floor(currentMinute) === this.lastMinute) return;
    const deltaMinutes = Math.max(1, Math.floor(currentMinute) - this.lastMinute);
    this.lastMinute = Math.floor(currentMinute);
    for (const building of this.village.buildings) {
      for (const [resource, value] of Object.entries(building.prodPerMinute)) {
        const type = resource as ResourceType;
        const base = value ?? 0;
        const bonus = isDay ? 1 : 1.2; // Night bonus
        const produced = base * deltaMinutes * bonus;
        this.village.resources[type] += produced;
      }
    }
    EventBus.emit('resources:updated', undefined);
  }

  spend(cost: Partial<Record<ResourceType, number>>): boolean {
    for (const [resource, value] of Object.entries(cost)) {
      const type = resource as ResourceType;
      if ((this.village.resources[type] ?? 0) < (value ?? 0)) {
        return false;
      }
    }
    for (const [resource, value] of Object.entries(cost)) {
      const type = resource as ResourceType;
      this.village.resources[type] -= value ?? 0;
    }
    EventBus.emit('resources:updated', undefined);
    return true;
  }

  getVillage() {
    return this.village;
  }
}
