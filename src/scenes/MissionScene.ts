import Phaser from 'phaser';
import { EventBus } from '../core/EventBus';
import type { MissionsSystem } from '../systems/MissionsSystem';

export default class MissionScene extends Phaser.Scene {
  private missionsSystem!: MissionsSystem;
  private missionText!: Phaser.GameObjects.Text;

  constructor() {
    super('MissionScene');
  }

  create() {
    this.missionsSystem = this.registry.get('missionsSystem');
    this.missionText = this.add.text(20, 500, '', { fontSize: '14px', color: '#fff' });

    EventBus.on('missions:updated', this.updateText);
    this.events.on('shutdown', () => {
      EventBus.off('missions:updated', this.updateText);
    });
    this.updateText();
  }

  private updateText = () => {
    const missions = this.missionsSystem.getMissions();
    const active = missions.filter((mission) => mission.status === 'ongoing');
    if (!active.length) {
      this.missionText.setText('No missions currently running.');
      return;
    }
    const lines = active.map(
      (mission) => `${mission.title} - ${mission.remainingMinutes.toFixed(1)} min left (${Math.round(mission.successChance * 100)}%)`
    );
    this.missionText.setText(lines.join('\n'));
  };
}
