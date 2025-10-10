import Phaser from 'phaser';
import BootScene from '../scenes/BootScene';
import PreloadScene from '../scenes/PreloadScene';
import VillageScene from '../scenes/VillageScene';
import UIScene from '../scenes/UIScene';
import MissionScene from '../scenes/MissionScene';

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1d1f27',
  scene: [BootScene, PreloadScene, VillageScene, MissionScene, UIScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};
