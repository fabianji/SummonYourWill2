# RPG Village Heroes

A Phaser 3 + Vite prototype that simulates a living hero village with day/night cycles, procedural missions, and persistent progress.

## Setup

```bash
npm install
npm run dev     # Start development server
npm run build   # Build production bundle (outputs to dist/)
npm run preview # Preview production build
npm run test    # Run unit tests (Vitest)
```

## Project Structure

```
/ (root)
├─ src/                # Phaser entry point, scenes, systems, utilities
├─ data/               # Static data sources (heroes)
├─ save/               # Default save-state split into logical sections
├─ docs/               # Design, architecture, changelog, and next steps
├─ public/             # Placeholder assets (if needed)
└─ dist/               # Generated via `npm run build`
```

Key systems:

- **VillageSystem** — Handles resource production, building upgrades, and integrates with the Economy tick.
- **HeroesSystem** — Loads hero avatars from Base64, manages favorites, energy, and pet visuals.
- **MissionsSystem** — Generates missions procedurally, computes success odds, and dispatches rewards.
- **TimeSystem** — Drives the day/night cycle and internal clock shared across UI and gameplay.
- **SaveSystem** — Splits save data into JSON slices, autosaves every 60 seconds and on tab hide.

UI panels (Heroes, Missions, Buildings) are built using DOM overlays managed by the UIScene and support keyboard shortcuts (H/M/B), custom tooltips, and log tracking.

## Modifying Data

- **Heroes**: Update `data/heroes.json` to add new heroes or adjust metadata. Ensure avatars and pets remain Base64 data URLs.
- **Default Save**: Adjust starting resources, missions, or pets via the files under `save/`. They will be used on first load and can be refreshed with the in-game **Load** button after clearing local storage.
- **Procedural Missions**: Tune generation logic in `src/systems/MissionsSystem.ts` to adjust difficulty curves, reward tables, or enemy variety.

After modifying data, run `npm run dev` to see changes immediately. For persistent sessions, use the in-game **Save** and **Load** controls or clear the browser's local storage keys prefixed with `rpg-village-heroes:`.

## Documentation

Additional details about architecture, data shapes, design rationale, and future work are available in the `docs/` folder.
