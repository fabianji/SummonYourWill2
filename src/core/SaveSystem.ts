import { EventBus } from './EventBus';
import type { HeroData, MissionData, SaveData, VillageData } from '../data/types';

const STORAGE_PREFIX = 'rpg-village-heroes';

function readLocalStorage<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Failed to parse storage', error);
    return null;
  }
}

function writeLocalStorage<T>(key: string, value: T) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
}

export class SaveSystem {
  private data: SaveData | null = null;
  private autosaveTimer?: number;

  async initialize(): Promise<SaveData> {
    const [heroes, village, missions, pets, meta] = await Promise.all([
      this.loadSection<HeroData[]>('heroes', '/save/heroes.json'),
      this.loadSection<VillageData>('village', '/save/village.json'),
      this.loadSection<MissionData[]>('missions', '/save/missions.json'),
      this.loadSection<Record<string, unknown>>('pets', '/save/pets.json'),
      this.loadSection<{ lastSaved: number }>('save', '/save/save.json')
    ]);

    this.data = {
      heroes,
      village,
      missions,
      pets,
      meta: meta ?? { lastSaved: Date.now() }
    };

    this.setupAutoSave();
    this.setupVisibilitySave();

    return this.data;
  }

  getData(): SaveData {
    if (!this.data) {
      throw new Error('SaveSystem not initialized');
    }
    return this.data;
  }

  updateData(partial: Partial<SaveData>) {
    if (!this.data) {
      throw new Error('SaveSystem not initialized');
    }
    this.data = { ...this.data, ...partial };
    EventBus.emit('log:message', 'Data updated, autosave scheduled.');
  }

  async saveNow() {
    if (!this.data) return;
    this.data.meta.lastSaved = Date.now();
    writeLocalStorage('heroes', this.data.heroes);
    writeLocalStorage('village', this.data.village);
    writeLocalStorage('missions', this.data.missions);
    writeLocalStorage('pets', this.data.pets);
    writeLocalStorage('save', this.data.meta);
    EventBus.emit('log:message', 'Game saved.');
  }

  async loadFromStorage(): Promise<SaveData | null> {
    const heroes = readLocalStorage<HeroData[]>('heroes');
    const village = readLocalStorage<VillageData>('village');
    const missions = readLocalStorage<MissionData[]>('missions');
    const pets = readLocalStorage<Record<string, unknown>>('pets');
    const meta = readLocalStorage<{ lastSaved: number }>('save');
    if (heroes && village && missions && pets && meta) {
      this.data = { heroes, village, missions, pets, meta };
      this.setupAutoSave();
      this.setupVisibilitySave();
      return this.data;
    }
    return null;
  }

  async loadSection<T>(key: string, path: string): Promise<T> {
    const stored = readLocalStorage<T>(key);
    if (stored) return stored;
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return (await response.json()) as T;
  }

  private setupAutoSave() {
    if (typeof window === 'undefined') return;
    if (this.autosaveTimer) {
      window.clearInterval(this.autosaveTimer);
    }
    this.autosaveTimer = window.setInterval(() => this.saveNow(), 60000);
  }

  private setupVisibilitySave() {
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveNow();
      }
    });
  }
}

export const saveSystem = new SaveSystem();
