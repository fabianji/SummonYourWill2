# Data Schemas

All runtime data adheres to JSON-friendly structures that mirror the initial specification. The `src/data/types.ts` file provides TypeScript interfaces for compile-time safety.

## Hero (`data/heroes.json`, `save/heroes.json`)

```json
{
  "id": "string",
  "name": "string",
  "level": 1,
  "sex": "male|female|neutral",
  "origin": "string",
  "professions": ["string"],
  "desc": "string",
  "favorite": false,
  "avatar": "data:image/...",
  "pet": "optional string",
  "petImg": "optional data:image/...",
  "petLevel": 1,
  "petDesc": "string",
  "petOrigin": "string",
  "petfavorite": false,
  "energy": 100,
  "maxEnergy": 100
}
```

## Village (`save/village.json`)

```json
{
  "resources": { "gold": 0, "stone": 0, "wood": 0, "food": 0 },
  "buildings": [
    { "id": "townhall", "level": 1, "prodPerMinute": { "gold": 1 } }
  ]
}
```

Each building optionally lists multiple resource keys. Production values are treated as floating-point per-minute yields.

## Mission (`save/missions.json`)

```json
{
  "id": "string",
  "title": "string",
  "difficulty": 1,
  "durationMin": 3,
  "energyCost": 5,
  "rewards": { "gold": 10, "wood": 0, "stone": 0, "food": 0 },
  "enemies": [{ "name": "Slime", "power": 5 }],
  "status": "available|ongoing|completed|failed",
  "assignedHeroes": ["heroId"]
}
```

`MissionsSystem` augments these structures at runtime with `remainingMinutes`, `successChance`, and `startedAt` metadata that remain compatible with JSON serialization.

## Pets (`save/pets.json`)

```json
{
  "PetName": {
    "bond": 72,
    "traits": ["Fiery", "Loyal"]
  }
}
```

## Meta (`save/save.json`)

```json
{ "lastSaved": 0 }
```

The `SaveSystem` writes each section back to localStorage individually using the `rpg-village-heroes:*` prefix.
