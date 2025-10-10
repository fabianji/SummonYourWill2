import mitt from 'mitt';

export type GameEvents = {
  'time:tick': number;
  'resources:updated': void;
  'heroes:updated': void;
  'missions:updated': void;
  'log:message': string;
  'ui:show-panel': 'heroes' | 'missions' | 'buildings';
};

const emitter = mitt<GameEvents>();

export const EventBus = {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit
};
