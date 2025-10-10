export type ResourceType = 'gold' | 'stone' | 'wood' | 'food';

export interface HeroData {
  id: string;
  name: string;
  level: number;
  sex: 'male' | 'female' | 'neutral';
  origin: string;
  professions: string[];
  desc: string;
  favorite: boolean;
  avatar: string;
  pet?: string;
  petImg?: string;
  petLevel?: number;
  petDesc?: string;
  petOrigin?: string;
  petfavorite?: boolean;
}

export interface BuildingData {
  id: string;
  level: number;
  prodPerMinute: Partial<Record<ResourceType, number>>;
}

export interface VillageData {
  resources: Record<ResourceType, number>;
  buildings: BuildingData[];
}

export interface MissionEnemy {
  name: string;
  power: number;
}

export type MissionStatus = 'available' | 'ongoing' | 'completed' | 'failed';

export interface MissionData {
  id: string;
  title: string;
  difficulty: number;
  durationMin: number;
  energyCost: number;
  rewards: Record<ResourceType, number>;
  enemies: MissionEnemy[];
  status: MissionStatus;
  assignedHeroes: string[];
}

export interface SaveData {
  heroes: HeroData[];
  missions: MissionData[];
  village: VillageData;
  pets: Record<string, unknown>;
  meta: {
    lastSaved: number;
  };
}
