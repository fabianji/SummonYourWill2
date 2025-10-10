import Phaser from 'phaser';
import { EventBus } from '../core/EventBus';
import { saveSystem } from '../core/SaveSystem';
import type { HeroesSystem, HeroState } from '../systems/HeroesSystem';
import type { VillageSystem } from '../systems/VillageSystem';
import type { MissionsSystem } from '../systems/MissionsSystem';
import { applyEllipsis } from '../utils/nameEllipsis';

export default class UIScene extends Phaser.Scene {
  private heroesSystem!: HeroesSystem;
  private villageSystem!: VillageSystem;
  private missionsSystem!: MissionsSystem;
  private root!: HTMLDivElement;
  private heroList!: HTMLDivElement;
  private heroDetail!: HTMLDivElement;
  private missionList!: HTMLDivElement;
  private buildingList!: HTMLDivElement;
  private logList!: HTMLUListElement;
  private timeLabel!: HTMLSpanElement;
  private resourceLabel!: HTMLDivElement;
  private tooltip!: HTMLDivElement;
  private selectedHeroId: string | null = null;
  private selectedForMission: Set<string> = new Set();
  private activePanel: 'heroes' | 'missions' | 'buildings' = 'heroes';
  private heroItemHeight = 116;

  constructor() {
    super('UIScene');
  }

  create() {
    this.heroesSystem = this.registry.get('heroesSystem');
    this.villageSystem = this.registry.get('villageSystem');
    this.missionsSystem = this.registry.get('missionsSystem');

    this.createDom();
    this.bindEvents();
    this.renderAll();
    this.registerListeners();
  }

  private createDom() {
    const parent = document.getElementById('game-container');
    if (!parent) throw new Error('Missing game container');
    this.root = document.createElement('div');
    this.root.className = 'ui-root';

    const topBar = document.createElement('div');
    topBar.className = 'top-bar';

    this.resourceLabel = document.createElement('div');
    this.resourceLabel.className = 'resources';
    topBar.appendChild(this.resourceLabel);

    this.timeLabel = document.createElement('span');
    this.timeLabel.className = 'time-display';
    topBar.appendChild(this.timeLabel);

    const actions = document.createElement('div');
    actions.className = 'top-actions';
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
      this.syncSaveData();
      saveSystem.saveNow();
    });
    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.addEventListener('click', async () => {
      const data = await saveSystem.loadFromStorage();
      if (data) {
        await this.heroesSystem.hydrate(data.heroes);
        const village = this.villageSystem.getVillage();
        Object.assign(village.resources, data.village.resources);
        village.buildings.splice(0, village.buildings.length, ...data.village.buildings);
        this.missionsSystem.hydrate(data.missions);
        this.renderAll();
        EventBus.emit('log:message', 'Loaded latest save.');
      } else {
        EventBus.emit('log:message', 'No save found in storage.');
      }
    });

    const heroesBtn = document.createElement('button');
    heroesBtn.textContent = 'Heroes (H)';
    heroesBtn.addEventListener('click', () => this.showPanel('heroes'));
    const missionsBtn = document.createElement('button');
    missionsBtn.textContent = 'Missions (M)';
    missionsBtn.addEventListener('click', () => this.showPanel('missions'));
    const buildingsBtn = document.createElement('button');
    buildingsBtn.textContent = 'Buildings (B)';
    buildingsBtn.addEventListener('click', () => this.showPanel('buildings'));

    actions.append(heroesBtn, missionsBtn, buildingsBtn, saveBtn, loadBtn);
    topBar.appendChild(actions);

    const panels = document.createElement('div');
    panels.className = 'panels';

    const heroesPanel = document.createElement('div');
    heroesPanel.className = 'panel active';
    heroesPanel.dataset.panel = 'heroes';

    this.heroList = document.createElement('div');
    this.heroList.className = 'hero-list';
    this.heroList.addEventListener('scroll', () => this.renderHeroList());

    this.heroDetail = document.createElement('div');
    this.heroDetail.className = 'hero-detail';

    const heroLayout = document.createElement('div');
    heroLayout.className = 'hero-layout';
    heroLayout.append(this.heroList, this.heroDetail);
    heroesPanel.appendChild(heroLayout);

    const missionsPanel = document.createElement('div');
    missionsPanel.className = 'panel';
    missionsPanel.dataset.panel = 'missions';
    this.missionList = document.createElement('div');
    this.missionList.className = 'mission-list';
    missionsPanel.appendChild(this.missionList);

    const buildingsPanel = document.createElement('div');
    buildingsPanel.className = 'panel';
    buildingsPanel.dataset.panel = 'buildings';
    this.buildingList = document.createElement('div');
    this.buildingList.className = 'building-list';
    buildingsPanel.appendChild(this.buildingList);

    const logsPanel = document.createElement('div');
    logsPanel.className = 'logs-panel';
    const logsTitle = document.createElement('h3');
    logsTitle.textContent = 'Logs';
    this.logList = document.createElement('ul');
    logsPanel.append(logsTitle, this.logList);

    panels.append(heroesPanel, missionsPanel, buildingsPanel, logsPanel);

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.style.display = 'none';

    this.root.append(topBar, panels, this.tooltip);
    parent.appendChild(this.root);
  }

  private bindEvents() {
    window.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'h') this.showPanel('heroes');
      if (event.key.toLowerCase() === 'm') this.showPanel('missions');
      if (event.key.toLowerCase() === 'b') this.showPanel('buildings');
    });
  }

  private registerListeners() {
    EventBus.on('resources:updated', this.updateResources);
    EventBus.on('heroes:updated', () => {
      this.renderHeroList();
      this.updateHeroDetail();
      this.syncSaveData();
    });
    EventBus.on('missions:updated', () => {
      this.renderMissionList();
      this.syncSaveData();
    });
    EventBus.on('time:tick', () => {
      this.updateTime();
    });
    EventBus.on('log:message', (message) => {
      this.pushLog(message);
    });
  }

  private renderAll() {
    this.updateResources();
    this.updateTime();
    this.renderHeroList();
    this.updateHeroDetail();
    this.renderMissionList();
    this.renderBuildings();
  }

  private showPanel(panel: 'heroes' | 'missions' | 'buildings') {
    this.activePanel = panel;
    const panels = Array.from(this.root.querySelectorAll('.panel')) as HTMLDivElement[];
    for (const element of panels) {
      element.classList.toggle('active', element.dataset.panel === panel);
    }
    EventBus.emit('ui:show-panel', panel);
  }

  private updateResources = () => {
    const village = this.villageSystem.getVillage();
    const entries = Object.entries(village.resources).map(([key, value]) => `${key}: ${value.toFixed(1)}`);
    this.resourceLabel.textContent = entries.join(' | ');
  };

  private updateTime = () => {
    const timeState = this.registry.get('timeState') as { day: number; minutes: number } | undefined;
    if (!timeState) return;
    const hour = Math.floor(timeState.minutes / 60)
      .toString()
      .padStart(2, '0');
    const minute = Math.floor(timeState.minutes % 60)
      .toString()
      .padStart(2, '0');
    this.timeLabel.textContent = `Day ${timeState.day} - ${hour}:${minute}`;
  };

  private renderHeroList() {
    const heroes = this.heroesSystem.getHeroes();
    const scrollTop = this.heroList.scrollTop;
    const visibleCount = Math.ceil((this.heroList.clientHeight || 400) / this.heroItemHeight) + 4;
    const startIndex = Math.max(0, Math.floor(scrollTop / this.heroItemHeight));
    const endIndex = Math.min(heroes.length, startIndex + visibleCount);

    this.heroList.innerHTML = '';
    const topSpacer = document.createElement('div');
    topSpacer.style.height = `${startIndex * this.heroItemHeight}px`;
    this.heroList.appendChild(topSpacer);

    for (let i = startIndex; i < endIndex; i++) {
      const hero = heroes[i];
      const card = this.createHeroCard(hero);
      this.heroList.appendChild(card);
    }

    const bottomSpacer = document.createElement('div');
    bottomSpacer.style.height = `${Math.max(0, heroes.length - endIndex) * this.heroItemHeight}px`;
    this.heroList.appendChild(bottomSpacer);
  }

  private createHeroCard(hero: HeroState) {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.dataset.id = hero.id;
    if (hero.favorite) card.classList.add('favorite');
    if (this.selectedHeroId === hero.id) card.classList.add('selected');

    const avatar = document.createElement('img');
    avatar.className = 'hero-avatar';
    avatar.src = hero.avatar;
    avatar.alt = hero.name;
    const { text, tooltip } = applyEllipsis(hero.name);

    const name = document.createElement('div');
    name.className = 'hero-name name-ellipsis';
    name.textContent = text;
    name.title = tooltip;

    const petWrapper = document.createElement('div');
    if (hero.pet && hero.petImg) {
      const pet = document.createElement('img');
      pet.src = hero.petImg;
      pet.alt = hero.pet;
      pet.className = 'pet-avatar';
      if (hero.petfavorite) pet.classList.add('favorite');
      petWrapper.appendChild(pet);
    }

    const info = document.createElement('div');
    info.className = 'hero-info';
    const level = document.createElement('div');
    level.textContent = `Level ${hero.level}`;
    const energy = document.createElement('div');
    energy.textContent = `Energy ${Math.round(hero.energy)}/${hero.maxEnergy}`;
    info.append(name, level, energy);

    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    const favBtn = document.createElement('button');
    favBtn.textContent = hero.favorite ? '★' : '☆';
    favBtn.setAttribute('aria-label', 'Toggle favorite');
    favBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.heroesSystem.toggleFavorite(hero.id);
      this.syncSaveData();
    });

    const assign = document.createElement('label');
    assign.className = 'assign-toggle';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = this.selectedForMission.has(hero.id);
    checkbox.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.checked) {
        this.selectedForMission.add(hero.id);
      } else {
        this.selectedForMission.delete(hero.id);
      }
    });
    assign.append('Mission', checkbox);

    actions.append(favBtn, assign, petWrapper);

    card.append(avatar, info, actions);

    card.addEventListener('mouseenter', (event) => {
      this.showTooltip(event as MouseEvent, tooltip);
    });
    card.addEventListener('mousemove', (event) => this.moveTooltip(event as MouseEvent));
    card.addEventListener('mouseleave', () => this.hideTooltip());
    card.addEventListener('click', () => {
      this.selectedHeroId = hero.id;
      this.updateHeroDetail();
      this.renderHeroList();
    });
    return card;
  }

  private updateHeroDetail() {
    this.heroDetail.innerHTML = '';
    if (!this.selectedHeroId) {
      const placeholder = document.createElement('p');
      placeholder.textContent = 'Select a hero to view details.';
      this.heroDetail.appendChild(placeholder);
      return;
    }
    const hero = this.heroesSystem.getHeroes().find((h) => h.id === this.selectedHeroId);
    if (!hero) return;
    const title = document.createElement('h3');
    title.textContent = hero.name;
    title.title = hero.name;

    const desc = document.createElement('p');
    desc.textContent = hero.desc;

    const origin = document.createElement('p');
    origin.textContent = `Origin: ${hero.origin}`;

    const professions = document.createElement('p');
    professions.textContent = `Professions: ${hero.professions.join(', ')}`;

    this.heroDetail.append(title, desc, origin, professions);
  }

  private renderMissionList() {
    this.missionList.innerHTML = '';
    const missions = this.missionsSystem.getMissions();
    missions.forEach((mission) => {
      const card = document.createElement('div');
      card.className = `mission-card status-${mission.status}`;

      const header = document.createElement('div');
      header.className = 'mission-header';
      header.textContent = `${mission.title} (Difficulty ${mission.difficulty})`;

      const duration = document.createElement('div');
      duration.textContent = `Duration: ${mission.durationMin} min | Energy Cost: ${mission.energyCost}`;

      const rewards = document.createElement('div');
      rewards.textContent = `Rewards: ${Object.entries(mission.rewards)
        .map(([k, v]) => `${k} ${v}`)
        .join(', ')}`;

      const chance = document.createElement('div');
      chance.textContent = `Success: ${Math.round(mission.successChance * 100)}%`;

      const assigned = document.createElement('div');
      assigned.textContent = `Assigned: ${mission.assignedHeroes.join(', ') || 'None'}`;

      const sendBtn = document.createElement('button');
      sendBtn.textContent = mission.status === 'available' ? 'Send Heroes' : mission.status.toUpperCase();
      sendBtn.disabled = mission.status !== 'available';
      sendBtn.addEventListener('click', () => this.handleMissionSend(mission.id));

      card.append(header, duration, rewards, chance, assigned, sendBtn);
      this.missionList.appendChild(card);
    });
  }

  private handleMissionSend(missionId: string) {
    const heroMap = new Map(this.heroesSystem.getHeroes().map((hero) => [hero.id, hero] as [string, HeroState]));
    const heroes = Array.from(this.selectedForMission)
      .map((id) => heroMap.get(id))
      .filter(Boolean) as HeroState[];
    if (!heroes.length) {
      EventBus.emit('log:message', 'Select heroes before sending them on a mission.');
      return;
    }
    const mission = this.missionsSystem.getMissions().find((m) => m.id === missionId);
    if (!mission) return;
    const insufficient = heroes.filter((hero) => hero.energy < mission.energyCost);
    if (insufficient.length) {
      EventBus.emit('log:message', 'Some heroes do not have enough energy.');
      return;
    }
    heroes.forEach((hero) => this.heroesSystem.consumeEnergy(hero.id, mission.energyCost));
    this.missionsSystem.assignHeroes(missionId, heroes);
    this.missionsSystem.startMission(missionId, heroes);
    this.selectedForMission.clear();
    this.renderHeroList();
    this.syncSaveData();
  }

  private renderBuildings() {
    this.buildingList.innerHTML = '';
    const village = this.villageSystem.getVillage();
    const defs = this.villageSystem.getDefinitions();
    village.buildings.forEach((building) => {
      const def = defs[building.id];
      const card = document.createElement('div');
      card.className = 'building-card';

      const header = document.createElement('div');
      header.className = 'building-header';
      header.textContent = `${def?.name ?? building.id} (Lv ${building.level})`;

      const desc = document.createElement('p');
      desc.textContent = def?.description ?? 'Structure';

      const prod = document.createElement('p');
      prod.textContent = `Production/min: ${Object.entries(building.prodPerMinute)
        .map(([k, v]) => `${k} ${v?.toFixed(1)}`)
        .join(', ')}`;

      const cost = def ? Math.floor(def.baseCost * Math.pow(def.costGrowth, building.level)) : 0;
      const costDisplay = document.createElement('p');
      costDisplay.textContent = `Upgrade Cost: ${cost} gold`;

      const upgradeBtn = document.createElement('button');
      upgradeBtn.textContent = 'Upgrade';
      upgradeBtn.addEventListener('click', () => {
        if (this.villageSystem.upgradeBuilding(building.id)) {
          this.renderBuildings();
          this.updateResources();
          this.syncSaveData();
        }
      });

      card.append(header, desc, prod, costDisplay, upgradeBtn);
      this.buildingList.appendChild(card);
    });
  }

  private showTooltip(event: MouseEvent, text: string) {
    this.tooltip.textContent = text;
    this.tooltip.style.display = 'block';
    this.moveTooltip(event);
  }

  private moveTooltip(event: MouseEvent) {
    this.tooltip.style.left = `${event.clientX + 16}px`;
    this.tooltip.style.top = `${event.clientY + 16}px`;
  }

  private hideTooltip() {
    this.tooltip.style.display = 'none';
  }

  private pushLog(message: string) {
    const entry = document.createElement('li');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.logList.prepend(entry);
    while (this.logList.childElementCount > 20) {
      this.logList.removeChild(this.logList.lastChild!);
    }
  }

  private syncSaveData() {
    saveSystem.updateData({
      heroes: this.heroesSystem.getHeroes(),
      missions: this.missionsSystem.getMissions(),
      village: this.villageSystem.getVillage()
    });
  }
}
