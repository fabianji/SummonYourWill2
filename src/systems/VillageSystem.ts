import type { BuildingData, VillageData } from '../data/types';
import { Economy } from '../core/Economy';
import { EventBus } from '../core/EventBus';

export interface BuildingDefinition {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  production: Partial<Record<'gold' | 'stone' | 'wood' | 'food', number>>;
}

const BUILDINGS: Record<string, BuildingDefinition> = {
  townhall: {
    id: 'townhall',
    name: 'Town Hall',
    description: 'Central hub of the village.',
    baseCost: 100,
    costGrowth: 1.6,
    production: { gold: 1 }
  },
  lumbermill: {
    id: 'lumbermill',
    name: 'Lumber Mill',
    description: 'Produces wood for construction.',
    baseCost: 80,
    costGrowth: 1.5,
    production: { wood: 1.2 }
  },
  quarry: {
    id: 'quarry',
    name: 'Stone Quarry',
    description: 'Extracts stone for building.',
    baseCost: 90,
    costGrowth: 1.45,
    production: { stone: 1 }
  },
  farm: {
    id: 'farm',
    name: 'Farm',
    description: 'Produces food to keep heroes energized.',
    baseCost: 70,
    costGrowth: 1.4,
    production: { food: 1.3 }
  }
};

export class VillageSystem {
  private economy: Economy;

  constructor(private data: VillageData) {
    this.ensureBuildings();
    this.economy = new Economy(this.data);
  }

  private ensureBuildings() {
    const existing = new Set(this.data.buildings.map((b) => b.id));
    for (const def of Object.values(BUILDINGS)) {
      if (!existing.has(def.id)) {
        this.data.buildings.push({
          id: def.id,
          level: 1,
          prodPerMinute: { ...def.production }
        });
      }
    }
  }

  tick(currentMinute: number, isDay: boolean) {
    this.economy.tick(currentMinute, isDay);
  }

  getVillage() {
    return this.data;
  }

  getEconomy() {
    return this.economy;
  }

  getDefinitions() {
    return BUILDINGS;
  }

  upgradeBuilding(id: string) {
    const building = this.data.buildings.find((b) => b.id === id);
    const def = BUILDINGS[id];
    if (!building || !def) return false;
    const cost = Math.floor(def.baseCost * Math.pow(def.costGrowth, building.level));
    const success = this.economy.spend({ gold: cost });
    if (!success) {
      EventBus.emit('log:message', 'Not enough gold to upgrade.');
      return false;
    }
    building.level += 1;
    for (const [resource, value] of Object.entries(def.production)) {
      building.prodPerMinute[resource as keyof typeof building.prodPerMinute] = (value ?? 0) * building.level;
    }
    EventBus.emit('log:message', `${def.name} upgraded to level ${building.level}.`);
    EventBus.emit('resources:updated', undefined);
    return true;
  }
}
