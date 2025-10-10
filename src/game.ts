import Phaser from 'phaser';
import { phaserConfig } from './config/phaserConfig';

let game: Phaser.Game | null = null;

export function createGame(parentId: string) {
  if (game) {
    return game;
  }
  const config = { ...phaserConfig, parent: parentId } as Phaser.Types.Core.GameConfig;
  game = new Phaser.Game(config);
  return game;
}

export function getGameInstance() {
  return game;
}
