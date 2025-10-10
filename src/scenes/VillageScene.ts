import Phaser from 'phaser';
import { TimeSystem } from '../core/TimeSystem';
import { EventBus } from '../core/EventBus';
import type { HeroesSystem, HeroState } from '../systems/HeroesSystem';
import type { VillageSystem } from '../systems/VillageSystem';
import type { MissionsSystem } from '../systems/MissionsSystem';

export default class VillageScene extends Phaser.Scene {
  private timeSystem!: TimeSystem;
  private heroesSystem!: HeroesSystem;
  private villageSystem!: VillageSystem;
  private missionsSystem!: MissionsSystem;
  private dayNightOverlay!: Phaser.GameObjects.Rectangle;
  private lastMinute = 0;

  constructor() {
    super('VillageScene');
  }

  create() {
    this.add.text(40, 40, 'Village Overview', { fontSize: '24px', color: '#fff' });
    this.add.rectangle(480, 270, 960, 540, 0x24313b, 0.6);

    this.timeSystem = new TimeSystem(this);
    this.heroesSystem = this.registry.get('heroesSystem');
    this.villageSystem = this.registry.get('villageSystem');
    this.missionsSystem = this.registry.get('missionsSystem');
    this.lastMinute = this.timeSystem.getState().minutes;

    this.dayNightOverlay = this.add.rectangle(480, 270, 960, 540, 0x000033, 0.25).setDepth(10);

    EventBus.emit('log:message', 'Village ready. Resources are being produced.');
  }

  update(time: number, delta: number) {
    this.timeSystem.update(time, delta);
    const state = this.timeSystem.getState();
    const currentMinute = state.minutes;
    this.villageSystem.tick(currentMinute, state.isDay);
    this.registry.set('timeState', { ...state });

    const deltaMinutes = Math.max(0, currentMinute - this.lastMinute);
    if (deltaMinutes > 0) {
      this.heroesSystem.recoverEnergy(deltaMinutes);
      const heroMap = new Map(this.heroesSystem.getHeroes().map((hero) => [hero.id, hero] as [string, HeroState]));
      this.missionsSystem.update(deltaMinutes, heroMap);
      this.lastMinute = currentMinute;
    }

    const alpha = state.isDay ? 0.15 : 0.45;
    this.dayNightOverlay.setFillStyle(state.isDay ? 0x87ceeb : 0x000022, alpha);
  }
}
