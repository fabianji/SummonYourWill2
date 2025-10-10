import Phaser from 'phaser';
import { saveSystem } from '../core/SaveSystem';
import { EventBus } from '../core/EventBus';
import { HeroesSystem } from '../systems/HeroesSystem';
import { VillageSystem } from '../systems/VillageSystem';
import { MissionsSystem } from '../systems/MissionsSystem';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  async create() {
    const data = saveSystem.getData();
    const heroesSystem = new HeroesSystem(this);
    await heroesSystem.hydrate(data.heroes);
    const villageSystem = new VillageSystem(data.village);
    const missionsSystem = new MissionsSystem();
    missionsSystem.hydrate(data.missions);
    missionsSystem.setRewardHandler((rewards) => {
      const village = villageSystem.getVillage();
      for (const [resource, value] of Object.entries(rewards)) {
        const key = resource as keyof typeof village.resources;
        village.resources[key] += value ?? 0;
      }
      EventBus.emit('log:message', 'Mission rewards delivered to the storehouses.');
      EventBus.emit('resources:updated', undefined);
    });

    this.registry.set('heroesSystem', heroesSystem);
    this.registry.set('villageSystem', villageSystem);
    this.registry.set('missionsSystem', missionsSystem);

    this.scene.start('VillageScene');
    this.scene.launch('MissionScene');
    this.scene.launch('UIScene');
  }
}
