import { EventBus } from './EventBus';

export interface TimeState {
  minutes: number;
  day: number;
  isDay: boolean;
}

export class TimeSystem {
  private state: TimeState = { minutes: 8 * 60, day: 1, isDay: true };
  private lastUpdate = 0;
  private speed = 60; // in-game minutes per real minute

  constructor(private scene: Phaser.Scene) {}

  update(time: number, delta: number) {
    if (!this.lastUpdate) {
      this.lastUpdate = time;
    }
    const minutesPassed = (delta / 1000) * this.speed;
    if (minutesPassed <= 0) return;
    this.state.minutes += minutesPassed;
    if (this.state.minutes >= 24 * 60) {
      this.state.minutes -= 24 * 60;
      this.state.day += 1;
    }
    const wasDay = this.state.isDay;
    this.state.isDay = this.getHour() >= 6 && this.getHour() < 18;
    if (wasDay !== this.state.isDay) {
      EventBus.emit('log:message', this.state.isDay ? 'Sun rises over the village.' : 'Night falls over the village.');
    }
    EventBus.emit('time:tick', this.state.minutes);
  }

  getHour() {
    return Math.floor(this.state.minutes / 60);
  }

  getMinute() {
    return Math.floor(this.state.minutes % 60);
  }

  getFormattedTime() {
    const hour = this.getHour().toString().padStart(2, '0');
    const minute = this.getMinute().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  getState() {
    return this.state;
  }
}
