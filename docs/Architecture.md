# Architecture

## Overview

The prototype is split between Phaser scenes for simulation and a DOM-driven UI overlay for rich interactions.

- **BootScene** loads persisted data or default save files via the `SaveSystem` before handing off to the loader.
- **PreloadScene** hydrates the game systems (heroes, village, missions) and launches gameplay + UI scenes.
- **VillageScene** runs the `TimeSystem`, drives day/night transitions, ticks the `Economy`, and updates mission progress.
- **MissionScene** provides a lightweight status banner summarising ongoing missions.
- **UIScene** builds the interactive panels (heroes, missions, buildings) as HTML elements layered over the canvas.

## Core Systems

- **SaveSystem** abstracts persistence: it lazily loads JSON slices (`save/*.json`), synchronises mutations, autosaves every 60s, and hooks into `visibilitychange` to avoid progress loss.
- **TimeSystem** maintains in-game minutes, emits ticks through the `EventBus`, and broadcasts day/night transitions.
- **Economy** computes per-minute resource production, applying a night bonus, and validates spending for upgrades.
- **HeroesSystem** instantiates hero state (energy, favorites) and converts Base64 avatars/pets into Phaser textures.
- **MissionsSystem** seeds procedural missions, computes success odds from hero stats, resolves outcomes, and pushes rewards back into the village via a reward handler callback.

All systems communicate through the lightweight `EventBus` (powered by `mitt`). The Phaser registry stores singletons for cross-scene access (`heroesSystem`, `villageSystem`, `missionsSystem`, and `timeState`).

## UI Composition

The UI scene creates a root overlay (`.ui-root`) anchored to `#game-container`. Each panel is pure DOM, enabling flexible layout and CSS-driven behaviors:

- **Top bar**: resources, time, Save/Load controls, and quick panel buttons with keyboard shortcuts.
- **Heroes panel**: virtualised list rendering only visible hero cards, ellipsis + tooltip support, mission assignment toggles, and detail sidebar.
- **Missions panel**: mission cards displaying difficulty, rewards, success chance, and status with send buttons.
- **Buildings panel**: building cards with production stats and upgrade actions.
- **Logs panel**: reverse chronological feed fed by `EventBus` messages.

Tooltips use a custom floating div updated on mouse move, while focus styles and keyboard shortcuts keep the UI accessible.

## Data Flow

1. Data loads from `save/` (or localStorage). Systems hydrate and keep references to the underlying data objects.
2. Gameplay (VillageScene) mutates state (resources, energy, mission timers) each update.
3. UIScene listens for change events and re-renders panels. It also calls `saveSystem.updateData(...)` after mutations to keep the persistence snapshot in sync.
4. Autosave writes split JSON blobs to localStorage every minute or when the page hides.

## Rendering Loop

- Phaser handles the background scene (day/night tint) and mission ticker.
- The DOM overlay handles complex UI, relying on event listeners rather than Phaser input.

This separation keeps the prototype flexible: future iterations can migrate panels into Phaser UI components or swap in different front-end frameworks while preserving the simulation core.
