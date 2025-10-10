import { HeroData, MissionData, VillageData } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateHero(data: unknown): HeroData {
  if (!isRecord(data)) {
    throw new Error('Hero must be an object');
  }
  const requiredString = ['id', 'name', 'origin', 'desc', 'avatar'];
  for (const key of requiredString) {
    if (typeof data[key] !== 'string') {
      throw new Error(`Hero ${key} must be string`);
    }
  }
  if (typeof data['level'] !== 'number') {
    throw new Error('Hero level must be number');
  }
  if (!Array.isArray(data['professions'])) {
    throw new Error('Hero professions must be array');
  }
  return data as unknown as HeroData;
}

export function validateHeroes(data: unknown): HeroData[] {
  if (!Array.isArray(data)) {
    throw new Error('Heroes must be an array');
  }
  return data.map(validateHero);
}

export function validateVillage(data: unknown): VillageData {
  if (!isRecord(data)) {
    throw new Error('Village must be object');
  }
  if (!isRecord(data['resources'])) {
    throw new Error('Village resources must be object');
  }
  if (!Array.isArray(data['buildings'])) {
    throw new Error('Village buildings must be array');
  }
  return data as unknown as VillageData;
}

export function validateMissions(data: unknown): MissionData[] {
  if (!Array.isArray(data)) {
    throw new Error('Missions must be an array');
  }
  return data as MissionData[];
}
