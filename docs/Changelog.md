# Changelog

[00:45] Boot & Architecture
- Scaffolded Vite + Phaser project, core configs, and data schema validators.
- Implemented SaveSystem bootstrap and base64 texture utilities.
- TODO: Verify runtime load ordering across slow networks.

[01:30] Village Systems
- Added Economy, VillageSystem definitions, and default save data.
- Implemented day/night aware resource tick and building upgrade hooks.
- TODO: Balance night bonus to avoid runaway resource growth.

[03:00] Heroes Experience
- Hydrated hero roster with Base64 avatars, favorites, and energy management.
- Built virtualised hero list and detail sidebar with tooltip support.
- TODO: Add hero filtering and sorting controls.

[04:30] Missions Gameplay
- Created procedural mission generator, success calculation, and reward handler.
- Linked hero energy consumption and mission logs.
- TODO: Display combat breakdown and enemy portraits.

[06:00] Integration & UX Polish
- Wired UIScene panels, Save/Load controls, autosave, and logs.
- Implemented keyboard shortcuts, custom tooltip, and pet highlight.
- TODO: Improve accessibility of custom tooltip for keyboard users.

[06:45] Build, Tests, Docs
- Added Vitest unit tests for RNG, Economy, Missions, and Base64 textures.
- Documented architecture, data schemas, decisions, and backlog.
- TODO: Capture gameplay screenshots and embed into docs.
