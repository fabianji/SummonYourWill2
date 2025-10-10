import type { HeroData } from '../data/types';
import { addBase64Texture } from '../utils/base64Texture';
import { EventBus } from '../core/EventBus';

export interface HeroState extends HeroData {
  energy: number;
  maxEnergy: number;
}

export class HeroesSystem {
  private heroes: HeroState[] = [];

  constructor(private scene: Phaser.Scene) {}

  async hydrate(data: HeroData[]) {
    this.heroes = data.map((hero) => ({
      ...hero,
      energy: 100,
      maxEnergy: 100
    }));
    for (const hero of this.heroes) {
      await addBase64Texture(this.scene, `hero-${hero.id}`, hero.avatar);
      if (hero.petImg) {
        await addBase64Texture(this.scene, `pet-${hero.id}`, hero.petImg);
      }
    }
    EventBus.emit('heroes:updated', undefined);
  }

  getHeroes() {
    return this.heroes;
  }

  toggleFavorite(id: string) {
    const hero = this.heroes.find((h) => h.id === id);
    if (hero) {
      hero.favorite = !hero.favorite;
      EventBus.emit('heroes:updated', undefined);
      EventBus.emit('log:message', `${hero.name} ${hero.favorite ? 'marked as favorite.' : 'is no longer favorite.'}`);
    }
  }

  consumeEnergy(id: string, amount: number) {
    const hero = this.heroes.find((h) => h.id === id);
    if (!hero) return false;
    if (hero.energy < amount) return false;
    hero.energy -= amount;
    EventBus.emit('heroes:updated', undefined);
    return true;
  }

  recoverEnergy(deltaMinutes: number) {
    for (const hero of this.heroes) {
      hero.energy = Math.min(hero.maxEnergy, hero.energy + deltaMinutes * 0.5);
    }
    EventBus.emit('heroes:updated', undefined);
  }
}
