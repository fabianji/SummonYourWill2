# Design Decisions

## Phaser + DOM Hybrid UI
Phaser 3 excels at rendering the simulation layer, but building dense management UIs is faster with standard HTML/CSS. The UIScene therefore mounts a DOM overlay, enabling:
- Rapid iteration on layout and accessibility.
- Native CSS ellipsis/tooltips and responsive panels.
- Easier future migration to a framework (React/Vue) without touching the simulation core.

## Data-Driven Bootstrap
All runtime state originates from JSON files (`save/*.json`), mirroring the split persistence approach requested. This keeps demo data editable without rebuilding, and the `SaveSystem` only falls back to network fetches if localStorage lacks a copy.

## Virtualised Hero List
With 200+ heroes as a requirement, the hero panel renders only the visible subset based on scroll position. Each card has a fixed height allowing simple spacer-based virtualization, keeping DOM nodes manageable.

## Event Bus for Loose Coupling
Instead of tightly coupling systems, a shared `EventBus` (mitt) carries updates (resources, missions, logs). This keeps future extensions—like notifications or analytics—simple to integrate.

## Autosave Strategy
Autosave runs every 60 seconds and on tab hide using the browser `visibilitychange` event. Manual save/load buttons trigger explicit persistence, offering clarity during playtests.

## Procedural Missions
`MissionsSystem` uses a seeded RNG to generate new missions when the roster is sparse, ensuring reproducibility per session while still feeling varied. Success chance scales with hero levels and current energy, encouraging roster management.

## Visual Identity
Favorites use a glowing gold outline animation (CSS) aligned with the fantasy theme. Pets inherit similar highlights when marked as `petfavorite`. Day/night transitions use a translucent overlay to keep the prototype readable while hinting at time-of-day modifiers.
