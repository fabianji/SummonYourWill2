import Phaser from 'phaser';
import { saveSystem } from '../core/SaveSystem';
import { validateHeroes, validateMissions, validateVillage } from '../data/schemas';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  async create() {
    const stored = await saveSystem.loadFromStorage();
    if (stored) {
      this.registry.set('saveData', stored);
      this.scene.start('PreloadScene');
      return;
    }
    try {
      const data = await saveSystem.initialize();
      validateHeroes(data.heroes);
      validateVillage(data.village);
      validateMissions(data.missions);
      this.registry.set('saveData', data);
    } catch (error) {
      console.error('Failed to bootstrap save data', error);
    }
    this.scene.start('PreloadScene');
  }
}
