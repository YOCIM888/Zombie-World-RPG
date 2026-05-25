# 📋 Zombie World - Data Maintenance Guide

## Core Principles

- **Game data is organized by module in the `js/data/` folder**, with each submodule responsible for different types of data
- **`js/config.js` serves as a unified re-export entry point**, all data is exposed through `config.js`, other files just need to import from `config.js`
- Refresh the browser after modifying data files in `js/data/` for changes to take effect
- Other files (`combat.js`, `maps.js`, `state.js`, etc.) don't need modification
- Adding new items just requires adding entries in the corresponding submodule array
- Some constants in `config.js` and `utils.js` are automatically derived (like `NURSE_MEDICINE_POOL`, `V_TRADE_AMMO_TYPES`, `BUILDING_MATERIAL_NAMES`, `BOSS_NAMES`), they update automatically when source data is modified

---

## 1. Data Folder Structure and Constant Overview

### 1.1 `js/data/` Folder Structure

| Path | Content | Included Constants |
|------|------|--------------------|
| `js/data/items/` | Item data | FOODS, FRUITS, DRINKS, MEDICINES, CIGARETTES, BUILDING_MATERIALS, CROPS, BACKPACK_TYPES, LOOT_BACKPACKS |
| `js/data/weapons/` | Weapon data | MELEE_WEAPONS, RANGED_WEAPONS, AMMO |
| `js/data/entities/` | Entity data | ZOMBIES, NPCS, SURVIVOR_NPC, NAMED_NPCS, BOSS_NAMES |
| `js/data/maps/` | Map data | MAPS, MAP_ACTIONS |
| `js/data/dialogues/` | Dialogue data | OUTLAW_DIALOGUES, MECHANIC_DIALOGUES, WOLF_DIALOGUES, WAREHOUSE_GUARD_DIALOGUES, NERVOUS_VETERAN_DIALOGUES, MAP_NPC_INTROS, CASTLE_GUARD_DIALOGUES, CASTLE_KING_DIALOGUES, CASTLE_QUEEN_DIALOGUES, CASTLE_BANKER_DIALOGUES, CASTLE_GUARD_HIGH_DIALOGUES, CASTLE_KING_HIGH_DIALOGUES, CASTLE_QUEEN_HIGH_DIALOGUES, CASTLE_BANKER_HIGH_DIALOGUES, CASTLE_REJECTION_DIALOGUES, DOCTOR_INTRO, DOCTOR_DIALOGUES, ZOMBIE_KING_INTRO, NURSE_ZOMBIE_INTRO, LEADER_DIALOGUES, GUYUE_DIALOGUES, LINHAN_DIALOGUES, YUMO_DIALOGUES |
| `js/data/systems/` | System configs | TIME_PHASES, GAME_CONSTANTS, DEFAULT_ITEM_IDS, AFFINITY_THRESHOLDS, AFFINITY_MAX, BASE_LEVELS, WAREHOUSE_LEVELS, CASTLE_RANKS, KING_QUESTS, SPECIAL_ITEMS, TRADER_WEAPON_SHOP, FIXED_LOOT_DROPS, TRADE_TEMPLATES, ACHIEVEMENTS, ENDING_STORIES, SURVIVAL_NOTES |
| `js/data/utils.js` | Utility data | CANNED_FOOD_IDS, TOOL_WEAPON_IDS, V_TRADE_AMMO_TYPES, LILI_REWARD_MEDICINE_IDS, XIAOHAN_REWARD_FOOD_IDS |

### 1.2 Constant List

Organized by code structure, all `export` constants and their uses:

| # | Constant Name | Type | Count | Purpose |
|---|---------------|------|-------|---------|
| 1 | `TIME_PHASES` | Array | 8 | 8 time phases in a day |
| 2 | `FOODS` | Array | 19 | Food list |
| 3 | `FRUITS` | Array | 11 | Fruit list |
| 4 | `DRINKS` | Array | 12 | Drink list |
| 5 | `MEDICINES` | Array | 14 | Medicine list |
| 6 | `NURSE_MEDICINE_POOL` | Array (auto-derived) | 6 | Nurse zombie medicine pool, auto-filtered from `MEDICINES` for `common`+`uncommon` |
| 7 | `CIGARETTES` | Array | 5 | Cigarette list |
| 8 | `BUILDING_MATERIALS` | Array | 6 | Building material list |
| 9 | `CROPS` | Array | 15 | Crop list |
| 10 | `MELEE_WEAPONS` | Array | 39 | Melee weapon list (including fist) |
| 11 | `RANGED_WEAPONS` | Array | 44 | Ranged weapon list |
| 12 | `AMMO` | Array | 13 | Ammunition list |
| 13 | `ZOMBIES` | Array | 16 | Zombie list |
| 14 | `NPCS` | Object | 4 | Encounter NPC templates (outlaw/mechanic/black market doctor) |
| 15 | `SURVIVOR_NPC` | Array | 3 | Outpost NPC full configs (V/Xiaohan/Lili) |
| 16 | `OUTLAW_DIALOGUES` | Array | 15 | Outlaw dialogues |
| 17 | `MECHANIC_DIALOGUES` | Array | 5 | Mechanic dialogues |
| 18 | `WOLF_DIALOGUES` | Array | 5 | Wolf dialogues |
| 19 | `WAREHOUSE_GUARD_DIALOGUES` | Array | 5 | Warehouse guard dialogues |
| 20 | `NERVOUS_VETERAN_DIALOGUES` | Array | 5 | Nervous veteran dialogues |
| 21 | `DOCTOR_INTRO` | String | 1 | Dr. Chen intro text |
| 22 | `DOCTOR_DIALOGUES` | Array | 5 | Dr. Chen dialogues |
| 23 | `ZOMBIE_KING_INTRO` | String | 1 | Zombie King intro text |
| 24 | `BACKPACK_TYPES` | Object | 14 | All backpack type definitions |
| 25 | `LOOT_BACKPACKS` | Array | 14 | Droppable backpack list (with rarity) |
| 26 | `MAPS` | Array | 22 | Map list (with loot table) |
| 27 | `CASTLE_GUARD_DIALOGUES` | Array | 5 | Castle guard dialogues |
| 28 | `CASTLE_KING_DIALOGUES` | Array | 5 | Castle King dialogues |
| 29 | `CASTLE_QUEEN_DIALOGUES` | Array | 5 | Castle Queen dialogues |
| 30 | `CASTLE_BANKER_DIALOGUES` | Array | 5 | Castle Banker dialogues |
| 31 | `NURSE_ZOMBIE_INTRO` | String | 1 | Nurse Zombie intro text |
| 32 | `CANNED_FOOD_IDS` | Array | 8 | Canned food ID list |
| 33 | `SPECIAL_ITEMS` | Object | 18 | Special items (noble ID card/dawn badge/silence badge/6th rank card/dawn captain badge/farming master badge/miaomiao diary/strange recorder/letter to sister/queen's reply/love token/castle pass/car key etc.) |
| 34 | `BASE_LEVELS` | Array | 5 | Outpost building levels |
| 35 | `WAREHOUSE_LEVELS` | Array | 8 | Warehouse levels (index 0 is null) |
| 36 | `AFFINITY_THRESHOLDS` | Array | 5 | Affinity stage thresholds |
| 37 | `AFFINITY_MAX` | Object | 5 | Affinity max per NPC |
| 38 | `NAMED_NPCS` | Object | 5 | Boss configs (Ma San/Shadow/Zombie King/Bank Manager/Outpost Leader) |
| 39 | `BOSS_NAMES` | Array (auto-derived) | 5 | Boss name list, auto-derived from `NAMED_NPCS` |
| 40 | `GAME_CONSTANTS` | Object | 22 groups | Global game params (including CRASH_MAX/INFECTION_MAX/MAX_HEALTH/TURNS_PER_DAY top-level constants) |
| 41 | `TOOL_WEAPON_IDS` | Array | 4 | Tool weapon IDs |
| 42 | `V_TRADE_AMMO_TYPES` | Array (auto-derived) | 11 | V's trade ammo types, auto-filtered from `AMMO` excluding arrows |
| 43 | `TRADER_WEAPON_SHOP` | Array | 6 | Black market weapon shop list + prices |
| 44 | `FIXED_LOOT_DROPS` | Object | 7 | Fixed drop configs |
| 45 | `BUILDING_MATERIAL_NAMES` | Object (auto-derived) | 6 | Building material ID→name map, auto-generated from `BUILDING_MATERIALS` |
| 46 | `TRADE_TEMPLATES` | Array | 4 | Trade templates |
| 47 | `SURVIVAL_NOTES` | Array | 7 | Survival notes (7 categories, 25 total tips) |
| 48 | `ACHIEVEMENTS` | Array | 19 | Achievement list |
| 49 | `ENDING_STORIES` | Object | 7 | Ending story texts |
| 50 | `DEFAULT_ITEM_IDS` | Object | 5 | Default item IDs |
| 51 | `LILI_REWARD_MEDICINE_IDS` | Array | 4 | Lili's reward medicine pool |
| 52 | `XIAOHAN_REWARD_FOOD_IDS` | Array | 3 | Xiaohan's reward food pool |
| 53 | `MAP_ACTIONS` | Object | 23 | Map action routing (data-driven) |
| 54 | `LEADER_DIALOGUES` | Array | 5 | Outpost Leader dialogues |
| 55 | `MAP_NPC_INTROS` | Object | 13 | Map NPC intro texts |
| 56 | `CASTLE_REJECTION_DIALOGUES` | Object | 3 | Castle rejection dialogues (V/Xiaohan/Lili) |
| 57 | `CASTLE_GUARD_HIGH_DIALOGUES` | Array | 5 | Castle guard (high rank) dialogues |
| 58 | `CASTLE_KING_HIGH_DIALOGUES` | Array | 5 | Castle King (high rank) dialogues |
| 59 | `CASTLE_QUEEN_HIGH_DIALOGUES` | Array | 5 | Castle Queen (high rank) dialogues |
| 60 | `CASTLE_BANKER_HIGH_DIALOGUES` | Array | 5 | Castle Banker (high rank) dialogues |
| 61 | `CASTLE_RANKS` | Array | 6 | Castle nobility ranks |
| 62 | `KING_QUESTS` | Array | 5 | King's quest chain |

---

## 2. Common Operation Guide

### 2.1 Adding Food

Add entry at the end of `FOODS` array.

**Field Description:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Unique identifier, globally unique |
| `name` | String | ✅ | Display name |
| `type` | String | ✅ | Fixed to `"food"` |
| `hunger` | Number | ✅ | Satiety restored |
| `hydration` | Number | ❌ | Hydration restored, skips hydration if omitted |

**Example: Adding "Braised Pork"**

```js
// Add at end of FOODS array
{ id: "braised_pork", name: "Braised Pork", type: "food", hunger: 50, hydration: 10 },
```

After adding, cheat system automatically supports `/get_food_braised_pork_5` format. Maps with `food` in loot table will automatically include new food.

---

### 2.2 Adding Melee Weapons

Add entry at the end of `MELEE_WEAPONS` array.

**Field Description:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Unique identifier |
| `name` | String | ✅ | Display name |
| `type` | String | ✅ | Fixed to `"melee"` |
| `damage` | Number | ✅ | Base damage |
| `durability` | Number | ✅ | Max durability (fist is `Infinity`) |
| `rarity` | String | ❌ | Rarity: `common`/`uncommon`/`rare`/`epic`/`legendary`, fist doesn't have this field |
| `comboRate` | Number | ✅ | Combo chance (0~1) |

**Example: Adding "Chainsaw Sword"**

```js
{ id: "chainsaw_sword", name: "Chainsaw Sword", type: "melee", damage: 110, durability: 90, rarity: "epic", comboRate: 0.16 },
```

**Rarity vs Combo Rate Relationship:**

| Rarity | Combo Rate | Damage Range Reference |
|--------|------------|-----------------------|
| common | 0.05 | 30~48 |
| uncommon | 0.08 | 40~70 |
| rare | 0.12 | 66~90 |
| epic | 0.15 | 99~105 |
| legendary | 0.18 | 118+ |

---

### 2.3 Adding Ranged Weapons

Adding ranged weapons requires **simultaneously paying attention to ammo links**, steps:

**Step 1: Add weapon in `RANGED_WEAPONS`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Unique identifier |
| `name` | String | ✅ | Display name |
| `type` | String | ✅ | Fixed to `"ranged"` |
| `damage` | Number | ✅ | Base damage |
| `integrity` | Number | ✅ | Integrity (usually 100) |
| `ammoType` | String | ✅ | Ammo type used, must match `id` in `AMMO` |
| `critRate` | Number | ✅ | Crit chance (0~1) |
| `rarity` | String | ✅ | Rarity |

**Step 2: If new ammo type needed, add in `AMMO`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Ammo unique ID |
| `name` | String | ✅ | Display name |
| `type` | String | ✅ | Fixed to `"ammo"` |
| `compatibleWith` | String[] | ✅ | Compatible weapon ID list |

**Step 3: If using existing ammo, add new weapon ID to corresponding ammo's `compatibleWith` array**

**Example: Adding "SCAR-H" (using existing 7.62×51mm)**

```js
// 1. Add at end of RANGED_WEAPONS
{ id: "scar_h", name: "SCAR-H", type: "ranged", damage: 85, integrity: 100, ammoType: "7.62x51mm", critRate: 0.28, rarity: "rare" },

// 2. Find "7.62x51mm" in AMMO, add "scar_h" to compatibleWith
{ id: "7.62x51mm", name: "7.62×51mm", type: "ammo", compatibleWith: ["m700", "fal", "ebr14", "sr25", "scar_h"] },
```

**Example: Adding "SCAR-H" (using new ammo 7.62×51mm NATO)**

```js
// 1. Add at end of RANGED_WEAPONS
{ id: "scar_h", name: "SCAR-H", type: "ranged", damage: 85, integrity: 100, ammoType: "7.62x51mm_nato", critRate: 0.28, rarity: "rare" },

// 2. Add new ammo at end of AMMO
{ id: "7.62x51mm_nato", name: "7.62×51mm NATO", type: "ammo", compatibleWith: ["scar_h"] },
```

**Crit Rate Reference (by weapon category):**

| Weapon Category | Crit Range | Ammo Type |
|-----------------|-----------|-----------|
| Bow/Crossbow | 0 | Arrow |
| Pistol | 0.15~0.20 | 9×19mm / .357 Magnum |
| SMG | 0.18~0.23 | 9×19mm |
| Rifle (5.56) | 0.22~0.25 | 5.56×45mm NATO |
| Rifle (7.62×39) | 0.20~0.28 | 7.62×39mm |
| Battle Rifle (7.62×51) | 0.22~0.32 | 7.62×51mm |
| Sniper | 0.35~0.45 | 7.62×51mm / .300 Win Mag |
| Shotgun | 0.10~0.12 | 12 Gauge |

---

### 2.4 Adding/Modifying Backpacks

Modifying backpacks requires maintaining both `BACKPACK_TYPES` and `LOOT_BACKPACKS` arrays simultaneously.

**Field Description:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Unique identifier, same as `name` |
| `name` | String | ✅ | Display name |
| `type` | String | ✅ | Fixed to `"backpack"` (in `BACKPACK_TYPES` it's specific backpack name) |
| `capacity` | Number | ✅ | Backpack capacity (slots) |
| `rarity` | String | ❌ | Rarity, only `LOOT_BACKPACKS` needs this |

#### `BACKPACK_TYPES` — All backpack type definitions

Acts as full backpack dictionary, **all available backpacks** are registered here. New game initial backpack also selected from here.

```js
export const BACKPACK_TYPES = {
  pocket: { id: "pocket", name: "Pocket", type: "pocket", capacity: 15 },
  // ... existing backpacks
};
```

**Add Example:**

```js
// Add new entry in BACKPACK_TYPES
  light_tactical: { id: "light_tactical", name: "Light Tactical Backpack", type: "light_tactical", capacity: 38 },
```

#### `LOOT_BACKPACKS` — Droppable backpack list

Controls which backpacks drop as loot and their rarity weights.

**Add Example:**

```js
// Add at end of LOOT_BACKPACKS
{ id: "light_tactical", name: "Light Tactical Backpack", type: "backpack", capacity: 38, rarity: "rare" },
```

**⚠️ Notes:**

1. **Both arrays must be in sync**: If only added in `LOOT_BACKPACKS` but not `BACKPACK_TYPES`, new backpack may not be recognized correctly when added to player inventory.
2. **`id` and `name` must match**: Backpack `id` and `name` must be same, this is a game logic convention.
3. **New backpack automatically included in drops**: After adding in `LOOT_BACKPACKS`, all maps with `backpack` in `lootTable` will randomly drop this backpack, no need to modify other files.
4. **Capacity suggestion range**:

| Rarity | Capacity Reference |
|--------|---------------------|
| common | 18~24 |
| uncommon | 26~32 |
| rare | 36~42 |
| epic | 48~56 |

---

### 2.5 Modifying Boss Drops

Modify corresponding entry in `FIXED_LOOT_DROPS`.

**Current Fixed Drops Overview:**

| Key Name | Source | Current Drop |
|----------|--------|--------------|
| `banker_kill` | Kill Bank Manager | Katana (melee) |
| `leader_gift` | Outpost Leader gift | Tang Hengdao (melee) |
| `doctor_trade` | Dr. Chen trade | M700 + 7.62×51mm×30 |
| `outlaw_kill` | Kill Ma San | AK47 + 7.62×39mm×30 |
| `shadow_kill` | Kill Shadow | GP100 + .357 Magnum×20 |
| `space_crate` | Space base crate | AWM + .300 Win Mag×30 |
| `tunnel_cache` | Tunnel cache | 9×19mm×20 + Compressed Biscuit |

**Example: Change Ma San drop from AK47 to HK416**

```js
outlaw_kill: { weaponId: "hk416", type: "ranged", ammoId: "5.56x45mm_nato", ammoCount: 30 },
```

**Example: Change Bank Manager drop to ranged weapon**

```js
banker_kill: { weaponId: "ebr14", type: "ranged", ammoId: "7.62x51mm", ammoCount: 30 },
```

**Note:** `type` field determines which array to look up weapon, `"melee"` looks up in `MELEE_WEAPONS`, `"ranged"` looks up in `RANGED_WEAPONS`. If drop includes ammo, `ammoId` must match `id` in `AMMO`.

---

### 2.6 Modifying Black Market Trader Items

Add/remove entries in `TRADER_WEAPON_SHOP`.

**Field Description:**

| Field | Type | Description |
|-------|------|-------------|
| `weaponId` | String | Weapon ID, must exist in `MELEE_WEAPONS` or `RANGED_WEAPONS` |
| `type` | String | `"melee"` or `"ranged"` |
| `costMin` | Number | Min cigarette price |
| `costMax` | Number | Max cigarette price |

**Example: Add new item "Small Knife"**

```js
{ weaponId: "small_knife", type: "melee", costMin: 3, costMax: 5 },
```

**Example: Add "MP5" ranged weapon**

```js
{ weaponId: "mp5", type: "ranged", costMin: 15, costMax: 20 },
```

---

### 2.7 Modifying Map Drop Rates

Adjust weights in `MAPS` `lootTable`. Weights are relative, don't need to sum to 100, but convention uses sum 100 for clarity.

**Available `lootTable` keys:**

| Key | Description | Corresponding Data Source |
|-----|-------------|---------------------------|
| `food` | Food | `FOODS` |
| `drink` | Drink | `DRINKS` |
| `fruit` | Fruit | `FRUITS` |
| `cigarette` | Cigarette | `CIGARETTES` |
| `medicine` | Medicine | `MEDICINES` (weighted by rarity) |
| `backpack` | Backpack | `LOOT_BACKPACKS` (weighted by rarity) |
| `melee` | Melee weapon | `MELEE_WEAPONS` (excluding fist, weighted by rarity) |
| `ranged` | Ranged weapon | `RANGED_WEAPONS` (weighted by rarity) |
| `ammo` | Ammo | `AMMO` (low danger maps have higher arrow chance) |
| `building` | Building material | `BUILDING_MATERIALS` |
| `empty` | No drop | — |

**Example: Increase ranged weapon drop rate for "Abandoned Police Station"**

```js
// Original
{ id: "abandoned_police_station", name: "Abandoned Police Station", danger: "★★★★ High Risk", encounterRate: 0.55,
  lootTable: { melee: 15, ranged: 15, ammo: 25, medicine: 10, backpack: 10, fruit: 10, food: 5, drink: 5, empty: 5 } },

// Modified: Increase ranged weight to 25, decrease ammo to 15
{ id: "abandoned_police_station", name: "Abandoned Police Station", danger: "★★★★ High Risk", encounterRate: 0.55,
  lootTable: { melee: 15, ranged: 25, ammo: 15, medicine: 10, backpack: 10, fruit: 10, food: 5, drink: 5, empty: 5 } },
```

---

### 2.8 Adjusting Game Balance

Modify in `GAME_CONSTANTS`, includes the following subcategories:

#### Global Caps

```js
CRASH_MAX: 100,              // Crash value cap (crash >= this, player crashes, can't fight/eat/drink/sleep)
INFECTION_MAX: 100,          // Infection value cap (infection >= this, player dies)
```

#### Survival Params (`SURVIVAL`)

```js
SURVIVAL: {
  HUNGER_DECAY: 4,              // Hunger decay per turn
  HYDRATION_DECAY: 4,           // Hydration decay per turn
  CRASH_THRESHOLD_TURNS: 16,    // Crash cycle (crash growth triggers every 16 turns)
  CRASH_PER_CYCLE: 20,          // Crash growth per cycle
  STARVATION_DAMAGE: 10,        // Damage from starvation/dehydration
  INFECTION_THRESHOLD: 50,      // Infection danger threshold
  CRASH_STATUS_THRESHOLD: 50,   // Crash danger threshold
  SEVERE_INJURY_THRESHOLD: 30,  // Severe injury threshold
},
```

#### Combat Params (`COMBAT`)

```js
COMBAT: {
  FLEE_RATE: 0.25,                // Flee success rate
  FLEE_RATE_TEXT: "Flee (25%)",    // Flee button text (derived from FLEE_RATE)
  RANGED_DODGE_RATE: 0.6,         // Ranged weapon dodge rate
  LIURUYAN_ASSIST_DAMAGE: 20,     // V's assist damage
  LIURUYAN_ASSIST_RATE: 0.3,      // V's assist trigger rate
  NPC_RANGED_TRIGGER_RATE: 0.4,   // NPC uses ranged weapon chance
  INFECTION_ON_HIT: 2,            // Infection increase when hit by zombie
  SUMMONED_ZOMBIE_DAMAGE: 8,      // Summoned zombie damage
  NURSE_HEAL_AFTER_COMBAT: 20,    // Nurse post-combat heal amount
  // Zombie ability params
  ABILITY_SCREECH_CRASH: 5,       // Screech crash increase
  ABILITY_TRIP_SKIP_RATE: 0.3,    // Trip skip turn rate
  ABILITY_BLIND_MISS_RATE: 0.5,   // Blind miss rate
  ABILITY_LEAP_DAMAGE_MULT: 0.6,  // Leap damage multiplier
  ABILITY_CLOAK_COUNTER_MULT: 0.5,// Cloak counterattack multiplier
  ABILITY_ARMOR_MULT: 0.5,        // Armor damage reduction multiplier
  ABILITY_CORRODE_DURABILITY: 5,  // Corrode melee durability
  ABILITY_CORRODE_INTEGRITY: 5,   // Corrode ranged integrity
  ABILITY_ACID_DAMAGE_MIN: 15,    // Acid min damage
  ABILITY_ACID_DAMAGE_MAX: 24,    // Acid max damage
  ABILITY_CLOAK_AMBUSH_RATE: 0.4, // Cloak ambush rate
  ABILITY_CLOAK_AMBUSH_MULT: 0.8, // Cloak ambush damage multiplier
  ABILITY_EXPLOSIVE_MULT: 2,      // Explosive damage multiplier
  // Loot params
  ZOMBIE_LOOT_DROP_RATE: 0.5,     // Zombie loot drop rate
  ZOMBIE_LOOT_FOOD_RATE: 0.5,     // Zombie drops food chance
  NPC_LOOT_DROP_RATE: 0.8,        // NPC loot drop rate
  TRADER_CIG_DROP_MIN: 2,         // Trader cigarette drop min
  TRADER_CIG_DROP_MAX: 5,         // Trader cigarette drop max
  // NPC combat params
  NPC_RANGED_OPENING_DAMAGE_MIN: 10, // NPC ranged opening min damage
  NPC_RANGED_OPENING_DAMAGE_MAX: 24, // NPC ranged opening max damage
  DEFAULT_NPC_DODGE_RATE: 0.2,       // NPC default dodge rate
  RANGED_INTEGRITY_LOSS: 5,          // Ranged weapon integrity loss per hit
  RANGED_SHOT_INTEGRITY_LOSS: 1,   // Ranged shot integrity consumption (per bullet -1)
},
```

#### Map Event Damage (`MAP_EVENTS`)

```js
MAP_EVENTS: {
  FACTORY_EXPLOSION_DAMAGE: 120,      // Factory explosion damage
  VETERAN_MISFIRE_DAMAGE: 40,         // Veteran misfire damage
  TUNNEL_COLLAPSE_DAMAGE: 80,         // Tunnel collapse damage
  TUNNEL_GAS_DAMAGE: 40,              // Tunnel gas damage
  TUNNEL_GAS_INFECTION: 10,           // Tunnel gas infection
  TUNNEL_ZOMBIE_SWARM_DAMAGE: 60,     // Tunnel zombie swarm damage
  FOOD_LOCKER_HUNGER_RESTORE: 30,     // Food locker hunger restore
  FOOD_LOCKER_HYDRATION_RESTORE: 30,  // Food locker hydration restore
  FOOD_LOCKER_BAD_FOOD_CRASH: 44,     // Spoiled food crash increase
  POLICE_TRAP_DAMAGE: 50,             // Police trap damage
  // New map event params
  TOWER_CRASH_REDUCTION: 10,          // Watchtower crash reduction
  FRUIT_REGROW_DAYS: 3,              // Fruit regrow days
  FRUIT_PICK_COUNT: 3,               // Fruit pick count
  CAVE_CIG_RATE: 0.1,                // Cave cigarette chance
  CORPSE_COOLDOWN_DAYS: 3,           // Corpse loot cooldown days
  FOOD_LOCKER_GOOD_RATE: 0.3,        // Food locker good food chance
  WOLF_TRADE_FOOD_COST: 3,           // Wolf trade food cost
  FACTORY_EXPLOSION_RATE: 0.3,       // Factory explosion chance
  RIVER_CRASH_REDUCTION: 10,         // Riverside crash reduction
  WAREHOUSE_BUILDING_COST: 10,       // Warehouse building material cost
  POLICE_TRAP_RATE: 0.7,             // Police trap chance
  POLICE_AMMO_MIN: 3,                // Police ammo min
  POLICE_AMMO_MAX: 8,                // Police ammo max
  VETERAN_MISFIRE_RATE: 0.5,         // Veteran misfire chance
  VETERAN_AMMO_GIVE_RATE: 0.5,       // Veteran gives ammo chance
  VETERAN_AMMO_MIN: 3,               // Veteran ammo min
  VETERAN_AMMO_MAX: 7,               // Veteran ammo max
  TUNNEL_CACHE_RATE: 0.15,           // Tunnel cache chance
  TUNNEL_COLLAPSE_RATE: 0.5,         // Tunnel collapse chance
  TUNNEL_GAS_RATE: 0.8,              // Tunnel gas chance
  SPACE_CRATE_RATE: 0.05,            // Space base crate chance
},
```

#### Castle Params (`CASTLE`)

```js
CASTLE: {
  WORK_HUNGER_COST: 18,          // Work hunger cost
  WORK_HYDRATION_COST: 18,       // Work hydration cost
  WORK_CRASH_GAIN: 40,           // Work crash gain
  BALL_CRASH_REDUCTION: 50,      // Ball crash reduction
  ROOM_HEALTH_RESTORE: 50,       // Room health restore
  NOBLE_ID_COST: 25,             // Noble ID card cost
  LOAN_TERM_DAYS: 10,            // Loan term (days)
  MERCY_EXTENSION_DAYS: 5,       // Grace period (days)
  // New castle params
  BANQUET_HUNGER_RESTORE: 50,    // Banquet hunger restore
  BANQUET_HYDRATION_RESTORE: 50, // Banquet hydration restore
  GARDEN_MEDICINE_RATE: 0.3,     // Garden medicine chance
  GARDEN_MEDICINE_COUNT: 3,      // Garden medicine count
  TREATMENT_AMOUNTS: [10, 30, 50, 80],   // Treatment amounts (by rank)
  TREATMENT_RANKS: [3, 4, 5, 6],         // Treatment corresponding ranks
  MEETING_RANK_REQUIRED: 5,     // Meeting required min rank
  GARDEN_RANK_REQUIRED: 6,      // Garden entry required min rank
  BANQUET_TIME_COST: 2,         // Banquet time cost (phases)
  BALL_TIME_COST: 2,            // Ball time cost (phases)
  ROOM_TIME_COST: 3,            // Room rest time cost (phases)
  MEETING_TIME_COST: 2,         // Meeting time cost (phases)
},
```

#### Doctor Params (`DOCTOR`)

```js
DOCTOR: {
  HEAL_AMOUNT: 120,                  // Heal health restore
  PSYCHOLOGY_CRASH_REDUCTION: 30,    // Psychology crash reduction
  TREATMENT_ITEM_COST: 5,            // Treatment item cost
  PSYCHOLOGY_FOOD_COST: 3,           // Psychology food cost
  SERUM_TRADE_COST: 50,              // Serum trade cost (cigarettes)
},
```

#### Rocket Params (`ROCKET`)

```js
ROCKET: {
  QUEST2_ENERGY_COST: 15,              // Rocket quest 2 pure energy cost (originally 30, reduced)
  QUEST3_MEDICINE_COST: 10,            // Rocket quest 3 medicine cost
  QUEST3_FOOD_COST: 10,                // Rocket quest 3 food cost
  QUEST3_DRINKS_COST: 10,              // Rocket quest 3 drink cost
  IMPROVED_SERUM_INFECTION_REDUCTION: 90, // Improved serum infection reduction
  HOPE_AFFINITY_REQUIRED: 150,         // Hope ending required affinity
  DISMANTLE_WEAPON_ID: "big_wrench",  // Dismantle nuke required weapon
  DISMANTLE_BACKPACK_ID: "dimensional_storage", // Dismantle nuke required backpack
  AWM_ID: "awm",                       // AWM weapon ID
},
```

#### Island Params (`ISLAND`)

```js
ISLAND: {
  REST_HEALTH_RESTORE: 30,           // Island rest health restore
  REST_CRASH_REDUCTION: 30,          // Island rest crash reduction
  REST_TIME_COST: 4,                 // Island rest time cost (phases)
  YACHT_GASOLINE_COST: 1,            // Yacht gasoline cost
  YACHT_TIME_COST: 8,                // Yacht time cost (phases)
},
```

#### Fishing Params (`FISHING`)

```js
FISHING: {
  CATCH_RATE: 0.6,                   // Fishing success rate
  CATCH_COUNT_MIN: 1,                // Min catch count
  CATCH_COUNT_MAX: 3,                // Max catch count
},
```

#### Duke Yumo Params (`YUMO`)

```js
YUMO: {
  TRADE_ROYAL_COIN_COST: 5,          // Yumo trade royal coin cost
  LOAN_INTEREST_RATE: 0.1,           // Island bank interest rate
  LOAN_TERM_DAYS: 30,                // Island bank repayment term
  LOAN_OVERDUE_PENALTY: 0.1,         // Island bank overdue penalty
},
```

#### Weather Probability (`WEATHER`)

```js
WEATHER: {
  PROBABILITIES: { sunny: 0.40, cloudy: 0.30, rainy: 0.10, hot: 0.05, foggy: 0.05, acid_rain: 0.05, sandstorm: 0.05 },
  EFFECTS: {
    rainy: { crash: 2 },       // Rain increases crash
    hot: { hydration: -5 },  // Hot extra hydration consumption
    sandstorm: { health: -2 },     // Sandstorm health damage
  },
},
```

#### Encounter Params (`ENCOUNTER`)

```js
ENCOUNTER: {
  NPC_RATE: 0.1,                                                    // NPC encounter rate
  NPC_DISTRIBUTION: { survivor: 0.6, wandering_trader: 0.2, doctor: 0.1, bandit: 0.1 },  // NPC type distribution
},
```

#### Sleep Params (`SLEEP`)

```js
SLEEP: {
  CRASH_REDUCTION_MIN: 10,       // Crash reduction min
  CRASH_REDUCTION_MAX: 25,       // Crash reduction max
  HEALTH_RECOVERY_MIN: 20,       // Health recovery min
  HEALTH_RECOVERY_MAX: 40,       // Health recovery max
  TIME_COST: 4,                  // Sleep time cost (phases)
},
```

#### Outpost Params (`OUTPOST`)

```js
OUTPOST: {
  WORK_HUNGER_COST: 6,           // Outpost work hunger cost
  WORK_HYDRATION_COST: 6,        // Outpost work hydration cost
  WORK_CRASH_GAIN: 5,            // Outpost work crash gain
  HONOR_WEAPON_ID: "vector",     // Honor reward weapon ID
  HONOR_AMMO_ID: "9x19mm",      // Honor reward ammo ID
  HONOR_AMMO_COUNT: 60,          // Honor reward ammo count
  LEADER_CHAT_AFFINITY: 1,       // Leader chat affinity gain
  LEADER_GIFT_AFFINITY: 1,       // Gift to leader affinity gain
},
```

#### Base Params (`BASE`)

```js
BASE: {
  UPGRADE_TIME_COST: 8,          // Base upgrade time cost (phases)
  WAREHOUSE_BASE_CAP: 30,        // Warehouse base capacity
  WAREHOUSE_CAP_PER_LEVEL: 10,   // Warehouse capacity per level
  MAX_WAREHOUSE_LEVEL: 7,        // Warehouse max level
  WAREHOUSE_UPGRADE_TIME: 2,     // Warehouse upgrade time cost (phases)
  FARMING_CROP_SLOTS: 5,         // Farming crop slots
},
```

#### Ending Params (`ENDINGS`)

```js
ENDINGS: {
  DAY_999_THRESHOLD: 999,               // 999 days ending threshold
  NEWFORCE_WEAPON_ID: "fearless_blade",       // New force ending weapon ID
  ENDING_999_BACKPACK_ID: "dimensional_storage", // 999 days ending backpack ID
  NEWFORCE_BOSS_NAME: "New Force Leader",     // New force boss name
  ALL_IDS: ["ending_death", "ending_999", "ending_prince", "ending_captain", "ending_newforce", "ending_space", "ending_hope", "ending_stay", "ending_farming", "ending_love_hate", "ending_food", "ending_elopement"],  // All ending ID list
},
```

#### Liu Ruyan Params (`LIURUYAN`)

```js
LIURUYAN: {
  RESCUE_DEADLINE_DAYS: 30,      // Rescue deadline days
  SERUM_COST: 3,                 // Serum cost count
},
```

#### Nurse Zombie Params (`NURSE_ZOMBIE`)

```js
NURSE_ZOMBIE: {
  BRING_HOME_AFFINITY: 150,      // Bring home affinity gain
  CANNED_AFFINITY_MIN: 2,        // Canned food affinity min
  CANNED_AFFINITY_MAX: 3,        // Canned food affinity max
  MAX_AFFINITY: 150,             // Affinity max
},
```

#### NPC Affinity Params (`NPC`)

```js
NPC: {
  GIFT_AFFINITY_FOOD: 3,         // Gift food affinity gain
  GIFT_AFFINITY_DRINKS: 3,       // Gift drinks affinity gain
  GIFT_AFFINITY_MEDICINE: 5,     // Gift medicine affinity gain
  GIFT_AFFINITY_CARGO: 2,        // Gift goods affinity gain
  LILI_GIFT_AFFINITY_FOOD: 6,    // Lili gift food affinity gain
  LILI_GIFT_AFFINITY_MEDICINE: 10, // Lili gift medicine affinity gain
  QUEST_AFFINITY_REWARD: 5,      // Quest completion affinity reward
  MAP_NPC_GIFT_AFFINITY: 2,      // Map NPC gift affinity gain
  CHAT_AFFINITY: 1,                 // Chat affinity gain
  V_TRADE_AMMO_MIN: 3,             // V trade ammo min count
  V_TRADE_AMMO_MAX: 12,            // V trade ammo max count
  LILI_TRADE_MED_COUNT_MIN: 1,     // Lili trade medicine min count
  LILI_TRADE_MED_COUNT_MAX: 3,     // Lili trade medicine max count
},
```

#### Achievement Params (`ACHIEVEMENTS`)

```js
ACHIEVEMENTS: {
  ZOMBIE_KILLS: [                    // Zombie kills achievements
    { threshold: 50, id: "zombie_hunter" },
    { threshold: 200, id: "zombie_slayer" },
  ],
  SURVIVAL_DAYS: [                   // Survival days achievements
    { threshold: 10, id: "survive_10" },
    { threshold: 30, id: "survive_30" },
    { threshold: 100, id: "survive_100" },
  ],
  EXPLORATION_MAPS: [                // Exploration maps achievements
    { threshold: 10, id: "explorer" },
    { threshold: 20, id: "collector" },
  ],
},
```

**Note:** Achievement thresholds are now data-driven by `GAME_CONSTANTS.ACHIEVEMENTS`, `checkSurvivalAchievements` and `checkExplorationAchievements` functions in `game.js` iterate these arrays to detect automatically. Adding new achievement levels just adds entries here, no need to modify logic code.

#### Loot Params (`LOOT`)

```js
LOOT: {
  RARITY_WEIGHTS: { common: 20, uncommon: 12, rare: 6, epic: 3, legendary: 1 },
  ARROW_CHANCE_LOW: 0.5,         // Low danger map arrow chance
  ARROW_CHANCE_MID: 0.3,         // Mid danger map arrow chance
  ARROW_CHANCE_HIGH: 0.1,        // High danger map arrow chance
  ARROW_COUNT_MIN: 3,            // Arrow count min
  ARROW_COUNT_MAX: 8,            // Arrow count max
  AMMO_COUNT_MIN: 5,             // Ammo count min
  AMMO_COUNT_MAX: 24,            // Ammo count max
},
```

#### Trade Params (`TRADING`)

```js
TRADING: {
  AMMO_PER_CIG_MIN: 3,           // Ammo per cigarette min
  AMMO_PER_CIG_MAX: 6,           // Ammo per cigarette max
},
```

#### Map Params (`MAP`)

```js
MAP: {
  DANGER_MESSAGES: {             // Danger level description texts
    "☆ Safe": "Looks safe here, good for looting.",
    "★ Easy": "Occasional zombies, stay alert.",
    "★★ Low Risk": "Zombies are active occasionally, need to be careful.",
    "★★★ Medium Risk": "Frequent zombie activity, proceed with caution.",
    "★★★★ High Risk": "Lots of zombies gathered, extremely dangerous!",
    "★★★★★ Extreme": "This is hell, don't come without preparation!",
    "★★★★★★ Inferno": "Death zone, only the strongest can leave alive!",
  },
},
```

---

### 2.9 Adding Maps

Add new entry in `MAPS` array.

**Field Description:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Unique identifier, also used for zombie pool assignment |
| `name` | String | ✅ | Display name |
| `danger` | String | ✅ | Danger level display text |
| `encounterRate` | Number | ✅ | Encounter rate (0~1), 0 means no zombie encounters |
| `noZombie` | Boolean | ❌ | Set to `true` for no zombies at all |
| `lootTable` | Object | ✅ | Loot weight table |

**Danger Level Reference:**

| Level | `danger` Value | `encounterRate` Reference |
|-------|----------------|--------------------------|
| Safe | `"☆ Safe"` | 0 |
| Easy | `"★ Easy"` | 0.03~0.10 |
| Low Risk | `"★★ Low Risk"` | 0.12~0.20 |
| Medium Risk | `"★★★ Medium Risk"` | 0.35~0.40 |
| High Risk | `"★★★★ High Risk"` | 0.50~0.55 |
| Extreme | `"★★★★★ Extreme"` | 0.60~0.70 |
| Inferno | `"★★★★★★ Inferno"` | 0.80~0.90 |

**Example: Adding "Abandoned Subway Station"**

```js
{
  id: "abandoned_subway",
  name: "Abandoned Subway Station",
  danger: "★★★★ High Risk",
  encounterRate: 0.5,
  lootTable: { ammo: 20, ranged: 10, melee: 10, food: 15, drink: 15, medicine: 10, fruit: 10, backpack: 5, empty: 5 }
},
```

**⚠️ Important Reminder:** After adding new map, also need to add map ID to zombie pool map in `getRandomZombie` function's `poolMap`, otherwise new map will default to low danger zombie pool:

```js
const poolMap = {
  // ... existing mappings ...
  "abandoned_subway": highPool,  // Add this line
};
```

---

### 2.10 Modifying NPC Quests

Modify in `SURVIVOR_NPC`'s `quests` object.

**Quest Field Description:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Quest name |
| `desc` | String | Quest description |
| `reqAffinity` | Number | Required affinity |
| `require` | Object | Submit requirements |
| `reward` | Object | Rewards |
| `story` | String | Quest story text |

**`require` supported formats:**

```js
// Food + drink
require: { food: 1, drinks: 1 }

// Specific medicine
require: { medicine: 5, medicineId: "tourniquet" }

// Specific drink
require: { drinks: 10, drinkId: "pure_milk" }

// Multiple item combination
require: { items: [{ type: "medicine", id: "medical_kit", count: 6 }, { type: "medicine", id: "anti_infection_serum", count: 6 }] }

// All medicines N each
require: { allMedicine: 2 }

// All canned foods 1 each
require: { allCanned: 1 }

// All fruits 1 each
require: { allFruits: 1 }

// All drinks + all foods 1 each
require: { allDrinks: 1, allFoods: 1 }
```

**`reward` supported formats:**

```js
// Single item
reward: { item: "small_knife", desc: "Small Knife ×1" }

// Item + ammo
reward: { item: "p226", ammo: { type: "9x19mm", count: 50 }, desc: "P226 ×1 + 9×19mm ×50" }

// Multiple items
reward: { itemStack: [{ id: "surgery_kit", count: 3 }], desc: "Surgery Kit ×3" }

// Cigarettes + ammo
reward: { cigarettes: 20, ammo: { type: "9x19mm", count: 50 }, desc: "Random Cigarettes ×20 + 9×19mm ×50" }
```

**Example: Modify V's v1 quest reward**

```js
v1: { name: "First Meeting Quest", desc: "Submit 1 food + 1 drink", reqAffinity: 0, require: { food: 1, drinks: 1 }, reward: { item: "big_wrench", desc: "Big Wrench ×1" }, story: "\"Can't fight on an empty stomach. Give me food, I'll give you a tool.\" She tapped the wall with a wrench." },
```

---

### 2.11 Modifying Default Items

Modify in `DEFAULT_ITEM_IDS`.

```js
export const DEFAULT_ITEM_IDS = {
  melee: "fist",        // Default melee weapon
  food: "compressed_biscuit",     // Default food
  drink: "mineral_water",      // Default drink
  seed: "seed",         // Default seed (corresponding seed in BUILDING_MATERIALS)
  serum: "anti_infection_serum",  // Default serum
};
```

**Note:** Modifying `melee` value affects new game initial weapon, this ID must exist in `MELEE_WEAPONS`.

---

### 2.12 Modifying NPC Trade Pools

#### Lili Trade Reward Medicine Pool

```js
export const LILI_REWARD_MEDICINE_IDS = ["tourniquet", "debridement_powder", "antibiotics", "anti_infection_serum"];
```

Adding new medicine ID expands Lili's trade reward range:

```js
export const LILI_REWARD_MEDICINE_IDS = ["tourniquet", "debridement_powder", "antibiotics", "anti_infection_serum", "surgery_kit"];
```

#### Xiaohan Trade Reward Food Pool

```js
export const XIAOHAN_REWARD_FOOD_IDS = ["compressed_biscuit", "wheat_bread", "beef_canned"];
```

Adding new food ID expands Xiaohan's trade reward range:

```js
export const XIAOHAN_REWARD_FOOD_IDS = ["compressed_biscuit", "wheat_bread", "beef_canned", "military_rations_canned"];
```

---

### 2.13 Modifying Survival Notes

Add/remove categories or entries in `SURVIVAL_NOTES` array.

**Data Structure Description:**

```js
SURVIVAL_NOTES = [
  {
    id: "category_id",        // Unique identifier, for routing
    name: "Category Name",      // Display category title
    entries: [             // Entry array in this category
      { title: "Entry Title", content: "Entry Content" },
      ...
    ]
  },
  ...
]
```

**Dynamic Entries:** Some entries in survival notes are dynamically generated by code, not in `SURVIVAL_NOTES` data:
- **New Force Progress** (`note_newforce`): Automatically appears when player completes any new force prerequisite, shows 6 conditions completion progress (X/6)
- **Liu Ruyan Rescue** (`note_liuruyan`): Automatically appears when player discovers Liu Ruyan, shows rescue remaining days

These dynamic entries are generated by `buildNewforceStory(state)` and `buildLiuruyanStory(state)` functions in `game/notes.js`.

**Example: Add new entry in "Basic Survival" category**

```js
{
  id: "basic_survival",
  name: "Basic Survival",
  entries: [
    { title: "Time and Turns", content: "A day is divided into 8 phases..." },
    { title: "Core Stats", content: "Satiety and hydration..." },
    { title: "Home and Safety", content: "At home..." },
    // New entry
    { title: "Sleep Recovery", content: "Sleeping restores health, reduces crash, and skips night phases." },
  ]
}
```

**Example: Add new category**

```js
// Add at end of SURVIVAL_NOTES array
{
  id: "crafting",
  name: "Crafting System",
  entries: [
    { title: "Basic Crafting", content: "Collect materials to craft advanced equipment and items." },
  ]
}
```

**Note:** If new category is added, need to confirm category routing handling in `handleSurvivalNotesAction` function in `game.js`, but data layer only needs to modify `config.js`.

---

### 2.14 Modifying Achievement Config

Add/remove entries in `ACHIEVEMENTS` array.

**Data Structure Description:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✅ | Unique identifier, for achievement unlock detection |
| `name` | String | ✅ | Achievement display name |
| `desc` | String | ✅ | Achievement description text |
| `icon` | String | ✅ | Achievement icon (suggest using emoji) |

**Example: Add new achievement**

```js
// Add at end of ACHIEVEMENTS array
{ id: "rich_man", name: "Rich Man", desc: "Cumulatively obtained 100 cigarettes", icon: "🚬" },
```

**⚠️ Important:** For survival days and exploration maps achievements, thresholds are now data-driven by `GAME_CONSTANTS.ACHIEVEMENTS.SURVIVAL_DAYS` and `GAME_CONSTANTS.ACHIEVEMENTS.EXPLORATION_MAPS`, detection functions in `game.js` automatically iterate these arrays. Adding new achievement levels just adds entries in `constants.js`. For other achievements (like kills, base upgrades, etc.), still need to manually add detection logic in `game.js`.

**Existing Achievement ID vs Unlock Conditions Reference:**

| Achievement ID | Condition | Detection Timing |
|----------------|-----------|-----------------|
| `survive_10` | Survival days >= 10 | Daily start |
| `survive_30` | Survival days >= 30 | Daily start |
| `survive_100` | Survival days >= 100 | Daily start |
| `zombie_hunter` | Zombie kills >= 50 | Combat win |
| `zombie_slayer` | Zombie kills >= 200 | Combat win |
| `explorer` | Explored maps >= 10 | Map exploration |
| `collector` | Explored all maps | Map exploration |
| `base_upgrade` | Base maxed | Base upgrade |
| `companion_recruit` | Recruited first companion | Companion rescue |
| `boss_killer` | Defeated first boss | Boss combat win |
| `noble_status` | Obtained noble ID | Castle purchase |
| `dawn_member` | Joined Dawn Outpost | Outpost join |

---

## 3. `js/data/` Folder Structure and Expansion Guide

### 3.1 Folder Organization Principle

`js/data/` folder divided into subdirectories by data type, each subdirectory contains:

- **Data files**: Defines specific constants and data
- **`index.js`**: Unified export of all constants in this directory

`js/data/index.js` serves as top-level entry, re-exports all constants from subdirectories' `index.js`. `js/config.js` then imports and re-exports from `js/data/index.js`, while providing utility functions.

### 3.2 Export Chain

```
Data file (like foods.js)
  → Subdirectory index.js (like items/index.js)
    → js/data/index.js
      → js/config.js (re-export + utility functions)
        → Other modules (like game.js, combat.js, etc.)
```

### 3.3 How to Add New Data Files

**Step 1: Create data file in corresponding subdirectory**

For example, add new `crops-ext.js` in `js/data/items/`:

```js
// js/data/items/crops-ext.js
export const SPECIAL_CROPS = [
  { id: "mutant_seed", name: "Mutant Seed", matureTurns: 10, yield: { food: "universal_injection" } },
];
```

**Step 2: Add export in subdirectory's `index.js`**

```js
// js/data/items/index.js
export { FOODS, FRUITS } from './foods.js';
export { DRINKS } from './drinks.js';
// ... existing exports ...
export { SPECIAL_CROPS } from './crops-ext.js';  // New
```

**Step 3: Import in `js/config.js` (if needed in utility functions)**

If new constant needs to be used in `config.js`'s utility functions, need to add to import statements; otherwise `export * from './data/index.js'` will automatically re-export, no extra operation needed.

### 3.4 How to Add New Subdirectory

If need to create entirely new data category (like `js/data/quests/`):

**Step 1: Create subdirectory and files**

```
js/data/quests/
  ├── index.js
  └── main-quests.js
```

**Step 2: Add export in `js/data/index.js`**

```js
export * from './quests/index.js';
```

**Step 3: Export constants in subdirectory's `index.js`**

```js
// js/data/quests/index.js
export { MAIN_QUESTS } from './main-quests.js';
```

### 3.5 Notes

1. **All constants eventually exported through `config.js`**: Other modules should import from `config.js`, not directly from `js/data/` subdirectories
2. **Derived constants in `utils.js`**: Derived constants like `CANNED_FOOD_IDS`, `TOOL_WEAPON_IDS`, `V_TRADE_AMMO_TYPES` are defined in `js/data/utils.js`, they depend on other submodules' data
3. **After adding new subdirectory**: Make sure to add `export *` statement in `js/data/index.js`, otherwise constants won't be exported
4. **File naming**: Use lowercase and hyphens (like `building-materials.js`, `map-actions.js`)

---

## 4. Rarity System Explanation

Game uses 5-tier rarity system, affects drop chance and weapon stats:

### Rarity Levels

| Rarity | English | Chinese | Drop Weight | Color Reference |
|--------|---------|---------|-------------|-----------------|
| common | common | Common | 20 | White/Gray |
| uncommon | uncommon | Uncommon | 12 | Green |
| rare | rare | Rare | 6 | Blue |
| epic | epic | Epic | 3 | Purple |
| legendary | legendary | Legendary | 1 | Orange/Gold |

### Drop Weight Explanation

Drop weights are used for weighted random selection in `pickRandomLoot` function. Higher weight = higher chance. Actual probability calculation:

```
Rarity chance = This rarity weight / Sum of all rarity weights
```

Taking melee weapons as example (weight sum = 20+12+6+3+1 = 42):

| Rarity | Weight | Approximate Chance |
|--------|--------|---------------------|
| common | 20 | 47.6% |
| uncommon | 12 | 28.6% |
| rare | 6 | 14.3% |
| epic | 3 | 7.1% |
| legendary | 1 | 2.4% |

### Melee Weapon Combo Rate vs Rarity Relationship

| Rarity | Combo Rate | Existing Weapon Examples |
|--------|------------|-------------------------|
| (Fist) | 0 | Fist |
| common | 0.05 | Kitchen Knife, Club, Pickaxe, Small Hammer, Frying Pan, Big Wrench, Baseball Bat, Iron Pipe, Shovel |
| uncommon | 0.08 | Small Knife, Butcher Knife, Baton, Crowbar, Claw Hammer, Hatchet, Fire Axe, Hunting Knife, Military Knife |
| rare | 0.12 | Brass Knuckles, Machete, Zhanma Dao, Nine Section Whip, Fencing Sword, Meteor Hammer, Steel Wakizashi, Dragon Stealing Sword, Long Cavalry Spear |
| epic | 0.15 | Dual Blades, Malay Sword, Katana, Tang Hengdao, Chainsaw |
| legendary | 0.18~0.20 | Hero's Sword, Universe Sword, Imperial Sword, **Fearless Blade**, Royal Silver Sword (0.20) |

### Ranged Weapon Crit Rate Range

Ranged weapon crit rate is related to weapon category, not directly tied to rarity:

| Weapon Category | Crit Range | Rarity Range |
|-----------------|-----------|--------------|
| Bow/Crossbow | 0 | common~rare |
| Pistol | 0.15~0.20 | common~rare |
| SMG | 0.18~0.23 | uncommon |
| LMG | 0.22~0.23 | rare |
| Rifle (5.56) | 0.22~0.27 | uncommon~epic |
| Rifle (7.62×39) | 0.20~0.28 | uncommon~rare |
| Battle Rifle (7.62×51) | 0.22~0.32 | rare~epic |
| Sniper | 0.35~0.45 | rare~legendary |
| Exclusive Weapon | 0.29~0.52 | legendary |
| Shotgun | 0.10~0.12 | uncommon~rare |

### Medicine Rarity

| Rarity | Medicine |
|--------|----------|
| common | Bandage, Glucose Solution, Zombie Gel |
| uncommon | Painkillers, Epinephrine, Tourniquet, Debridement Powder |
| rare | Surgery Kit, Antibiotics, Anti-Infection Serum |
| epic | Medical Kit, Field Medical Kit |
| legendary | Universal Injection, Improved Serum |

### Backpack Rarity

| Rarity | Backpack | Capacity |
|--------|----------|----------|
| common | Handbag, Small Waist Pack, Small Backpack, Canvas Backpack | 18, 20, 22, 24 |
| uncommon | Fashion Backpack, Sports Backpack, Hiking Backpack | 26, 28, 32 |
| rare | Military Backpack, Tactical Backpack, Special Ops Backpack | 36, 39, 42 |
| epic | Large Hiking Backpack, Extra Large Travel Backpack, Extra Large Heavy Duty Backpack | 48, 56, 64 |
| legendary | Dimensional Storage Backpack | 68 |

### Special Items (SPECIAL_ITEMS)

| Key Name | ID | Name | Description |
|----------|-----|------|-------------|
| `noble_id` | `noble_id` | Noble ID Card | Basic noble identity |
| `viscount_id` | `viscount_id` | Viscount ID Card | Viscount rank |
| `count_id` | `count_id` | Count ID Card | Count rank |
| `marquis_id` | `marquis_id` | Marquis ID Card | Marquis rank |
| `duke_id` | `duke_id` | Duke ID Card | Duke rank |
| `crown_prince_id` | `crown_prince_id` | Crown Prince ID Card | Crown Prince rank |
| `dawn_badge` | `dawn_badge` | Dawn Badge | Dawn Outpost member |
| `dawn_captain_badge` | `dawn_captain_badge` | Dawn Captain Badge | Dawn Vanguard Captain |
| `silence_badge` | `silence_badge` | Silence Badge | Defeated Zombie King·Silence souvenir |
| `underground_key` | `underground_key` | Underground Key | Basement key |
| `farming_master_badge` | `farming_master_badge` | Farming Master Badge | Farming master souvenir |
| `miaomiao_diary` | `miaomiao_diary` | Miaomiao's Diary | Miaomiao's diary |
| `strange_recorder` | `strange_recorder` | Strange Recorder | Recorder |
| `letter_to_sister` | `letter_to_sister` | Letter to Sister | Outpost Leader's letter |
| `queen_reply` | `queen_reply` | Queen's Reply | Queen's reply |
| `love_token` | `love_token` | Love Token | Sunflower pendant |
| `castle_pass` | `castle_pass` | Castle Pass | Castle access pass |
| `car_key` | `car_key` | Car Key | Liu Ruyan quest 3 reward, quest 4 prerequisite |

### Castle Ranks (CASTLE_RANKS)

Game has total 6 rank system:

| Rank | Name | rank Value | ID Card |
|------|------|-----------|---------|
| 1 | Noble | 1 | `noble_id` |
| 2 | Viscount | 2 | `viscount_id` |
| 3 | Count | 3 | `count_id` |
| 4 | Marquis | 4 | `marquis_id` |
| 5 | Duke | 5 | `duke_id` |
| 6 | Crown Prince | 6 | `crown_prince_id` |

### Achievement List (ACHIEVEMENTS)

The game has a total of 17 achievements, including 5 ending achievements:

| Achievement ID | Name | Condition |
|----------------|------|-----------|
| `survive_10` | Survive 10 Days | Days >= 10 |
| `survive_30` | Survive 30 Days | Days >= 30 |
| `survive_100` | Survive 100 Days | Days >= 100 |
| `zombie_hunter` | Zombie Hunter | Kills >= 50 |
| `zombie_slayer` | Zombie Slayer | Kills >= 200 |
| `explorer` | Explorer | Explored maps >= 10 |
| `collector` | Collector | Explored all maps |
| `base_upgrade` | Home | Base maxed |
| `companion_recruit` | Companion | Recruited first companion |
| `boss_killer` | Boss Hunter | Defeated first boss |
| `noble_status` | Noble Status | Obtained noble identity |
| `dawn_member` | Dawn | Joined Dawn Outpost |
| `ending_farming` | I'm Not the Farmer God | Achieved ending: I'm Not the Farmer God |
| `ending_love_hate` | Love and Hate | Achieved ending: Love and Hate |
| `ending_death` | The End | Achieved ending: Death |
| `ending_999` | Unknown Future | Achieved ending: Unknown Future |
| `ending_prince` | Addiction to Power | Achieved ending: Addiction to Power |
| `ending_captain` | Shine Bright | Achieved ending: Shine Bright |
| `ending_newforce` | Become a New Force | Achieved ending: Become a New Force |

---

## 5. Data Relationship Diagram

The following constants have reference relationships, please note linkage when modifying:

### Ammunition ↔ Weapon (Bidirectional Relationship)

```
AMMO.compatibleWith[]  ←→  RANGED_WEAPONS.ammoType
```

- Every ranged weapon's `ammoType` must have a corresponding entry in `AMMO`
- Every ammunition's `compatibleWith` must include all weapon IDs using that ammunition
- **When adding a new ranged weapon**: If using existing ammunition, add the weapon ID to the ammunition's `compatibleWith`
- **When adding new ammunition**: Ensure all weapons using that ammunition are in `compatibleWith`

### Fixed Drops → Item Arrays

```
FIXED_LOOT_DROPS.weaponId  →  MELEE_WEAPONS / RANGED_WEAPONS
FIXED_LOOT_DROPS.ammoId    →  AMMO
FIXED_LOOT_DROPS.foodId    →  FOODS
```

- When `type` field is `"melee"`, `weaponId` looks up from `MELEE_WEAPONS`
- When `type` field is `"ranged"`, `weaponId` looks up from `RANGED_WEAPONS`

### Default Items → Various Item Arrays

```
DEFAULT_ITEM_IDS.melee  →  MELEE_WEAPONS
DEFAULT_ITEM_IDS.food   →  FOODS
DEFAULT_ITEM_IDS.drink  →  DRINKS
DEFAULT_ITEM_IDS.seed   →  BUILDING_MATERIALS
DEFAULT_ITEM_IDS.serum  →  MEDICINES
```

### Automatic Derivation Relationships

```
NURSE_MEDICINE_POOL  ←  MEDICINES.filter(rarity === "common" || rarity === "uncommon")
V_TRADE_AMMO_TYPES   ←  AMMO.filter(id !== "arrow").map(id)
BUILDING_MATERIAL_NAMES  ←  BUILDING_MATERIALS traverse generate {id: name}
BOSS_NAMES           ←  NAMED_NPCS traverse generate name array
```

After modifying source data, these derived constants will update automatically, no manual modification needed.

### Boss Name Derivation

```
NAMED_NPCS  →  BOSS_NAMES (Auto-derived)
```

`BOSS_NAMES` is automatically generated via `Object.values(NAMED_NPCS).map(npc => npc.name)`. After adding or modifying entries in `NAMED_NPCS`, `BOSS_NAMES` will update automatically.

### Map Action Routing

```
MAP_ACTIONS  →  routing.js (Data-driven routing)
```

`MAP_ACTIONS` defines available action buttons and corresponding action identifiers for each map. `routing.js` routes to corresponding processing logic based on action identifiers. When adding new map actions, need to simultaneously add entry in `MAP_ACTIONS` and corresponding processing function in `routing.js`.

### Map NPC Introduction Text

```
MAP_NPC_INTROS  →  maps.js (NPC introduction text)
```

`MAP_NPC_INTROS` stores appearance introduction text, combat text, and leave text for map NPCs. During map exploration, corresponding introduction is displayed based on NPC type.

### Outpost Leader Dialogues

```
LEADER_DIALOGUES  →  outpost.js (Leader dialogues)
```

`LEADER_DIALOGUES` stores the outpost leader's dialogue content, randomly selected for display during outpost interaction.

### Castle Rejection Dialogues

```
CASTLE_REJECTION_DIALOGUES  →  npcs/index.js (Rejection dialogues)
```

`CASTLE_REJECTION_DIALOGUES` stores dialogue text when outpost NPCs refuse interaction when player has a castle identity card. Keys are NPC IDs (v, xiaohan, lili).

### NPC Quest Rewards → Item Arrays

```
SURVIVOR_NPC.quests.reward.item      →  MELEE_WEAPONS / RANGED_WEAPONS
SURVIVOR_NPC.quests.reward.ammo.type →  AMMO
SURVIVOR_NPC.quests.require.medicineId →  MEDICINES
SURVIVOR_NPC.quests.require.drinkId    →  DRINKS
```

### Trading Related

```
TRADER_WEAPON_SHOP.weaponId  →  MELEE_WEAPONS / RANGED_WEAPONS
LILI_REWARD_MEDICINE_IDS     →  MEDICINES
XIAOHAN_REWARD_FOOD_IDS      →  FOODS
TRADE_TEMPLATES.ammoType     →  AMMO
```

### Map → Zombie Pool

```
MAPS.id  →  getRandomZombie() poolMap mapping
```

After adding new map ID, need to add corresponding mapping in `poolMap`.

### Canned Food List

```
CANNED_FOOD_IDS  →  FOODS (subset)
```

Used for Su Xiaohan's "Canned Food Collection" quest. If adding new canned food items, need to update this array synchronously.

### Tool Weapons

```
TOOL_WEAPON_IDS  →  MELEE_WEAPONS (subset)
```

Identifies which melee weapons belong to the "tool" category.

---

## 6. Notes

### 1. IDs Must Be Globally Unique

Each item's `id` must be unique within its array. It is recommended to keep unique across arrays to avoid confusion.

### 2. Modifying IDs Will Affect Save Compatibility

Player saves store item `id`s. If you modify an item's `id`, old saves referencing that `id` will not match correctly. **If you need to rename, it is recommended to only modify the `name` field and keep `id` unchanged.**

### 3. Adding New Items Does Not Require Modifying Other Files

Just add entries in the corresponding array, the drop system, cheat system, etc., will automatically recognize new items.

### 4. Deleting Items Requires Checking All References

Before deleting an item, must check the following locations for references to it:
- `weaponId`, `ammoId`, `foodId` in `FIXED_LOOT_DROPS`
- Various fields in `DEFAULT_ITEM_IDS`
- `compatibleWith` in `AMMO`
- `weaponId` in `TRADER_WEAPON_SHOP`
- `require` and `reward` of quests in `SURVIVOR_NPC`
- `LILI_REWARD_MEDICINE_IDS` and `XIAOHAN_REWARD_FOOD_IDS`
- `CANNED_FOOD_IDS`
- `TOOL_WEAPON_IDS`
- `ammoType` in `TRADE_TEMPLATES`

### 5. rarity Field Must Be One of 5 Values

Valid rarity values: `"common"`, `"uncommon"`, `"rare"`, `"epic"`, `"legendary"`. If using a rarity not among these 5 values, the weighted random in the drop system will use default weight 1, which may lead to unexpected behavior.

### 6. Ammunition compatibleWith Must Correspond to Weapon ammoType

- Every ranged weapon's `ammoType` must exist in `AMMO`
- Every ammunition's `compatibleWith` in `AMMO` must include all weapons using that ammunition
- Both must be synchronized, otherwise will cause ammunition cannot be loaded or weapon cannot fire

### 7. type in FIXED_LOOT_DROPS Determines Lookup Range

- `type: "melee"` → lookup `weaponId` from `MELEE_WEAPONS`
- `type: "ranged"` → lookup `weaponId` from `RANGED_WEAPONS`
- If `type` does not match actual weapon type, corresponding weapon will not be found

### 8. Map ID and Zombie Pool Mapping

`getRandomZombie` function uses map `id` to exactly match zombie pool. When adding a new map, be sure to add mapping in `poolMap`, otherwise will default to low danger zombie pool.

### 9. Cheat Command Format

The cheat system uses item type and ID to generate commands, format is `/get_{type}_{id}_{count}`. Where `type` corresponds to item's `type` field value. For example:
- `/get_food_compressed_biscuit_5`
- `/get_melee_katana_1`
- `/get_ranged_ak47_1`
- `/get_medicine_antibiotics_3`

### 10. Royal Coin System

Royal coins (`royal_coin`) is an independent currency, does not occupy backpack space, stored in `state.royalCoins`.
- Added via `addItem({ type: "royal_coin", count: N })`
- Deducted via `removeRoyalCoins(N)`
- Old saves automatically complement `royalCoins: 0` via `normalizeState()`

### 11. Gasoline System

Gasoline is a stackable special cargo, does not occupy backpack slots, stored in `state.gasoline`.
- Added via `addGasoline(N)`
- Deducted via `removeGasoline(N)`, returns actual deducted amount
- Can also be added via `addItem({ type: "gasoline", count: N })` (internally calls `addGasoline`)
- Can also be deducted via `removeItem("gasoline", N)` (internally calls `removeGasoline`)
- Old saves automatically complement `gasoline: 0` via `normalizeState()`
- Cheat code: `/get_gasoline_gasoline_5` (obtain 5 each time)
- Gasoline displayed alongside cigarettes and royal coins in UI cargo panel
- Gasoline supports discard and NPC gifting functions

### 12. Story Exclusive Weapons

Some weapons are only obtained through specific stories, cannot be randomly obtained from drop pools:
- **Prairie Bow** (Mu Miaomiao quest 3 reward) — excluded in `pickRandomLoot`
- **Royal Short Gun** (Queen grocery store purchase) — excluded in `pickRandomLoot`
- **Royal Silver Sword** (Queen grocery store purchase) — excluded in `pickRandomLoot`
- **Fearless Blade** (New Force ending reward) — excluded in `pickRandomLoot`

### 13. Interaction Design Standards

When adding or modifying NPC interactions, need to follow these standards:

1. **No Early Return**: NPC interaction entry functions must not use `if (!condition) { setStory(); refreshMenu(); return; }` pattern. Should always display NPC dialogue page and at least one "Back" option, only display dialogue text + Back option when conditions not met.

2. **Crash Value 100% Behavior**: When crash value is full, player cannot fight, eat, drink, or sleep. When refusing to eat/drink, should prompt for available medical items (painkillers/epinephrine, etc.) to restore morale. When crash is full, only allow use of crash-lowering medicines.

3. **Trade Backpack Space Pre-check**: Before deducting player items, trade system should check if backpack has enough space for reward items, refuse trade if insufficient space.

4. **Dangerous Operation Warning**: Irreversible choices (like Ma San quest 4) and high-risk operations (like eating strange meat +10 infection) should display ⚠ warning.

5. **Disabled Option Feedback**: When clicking disabled options, should display "Conditions not met" prompt instead of silent no response.

6. **Return After Using Consumables**: After using food/drinks/medicine, should return to corresponding selection interface instead of main menu, for convenient continuous use.

7. **Black Market Trader Ammo Quantity Selection**: When purchasing ammunition, support quantity selection (1/5/10/all cigarettes), no longer consume all cigarettes at once.

8. **Liu Ruyan Rescue Reminder**: After discovering Liu Ruyan, survival notes automatically add rescue countdown. `state.liuruyanDiscovered` field tracks if discovered.

9. **New Force Progress Tracking**: After completing any New Force prerequisite, survival notes automatically add progress entry (X/6).

10. **Rocket Hope Ending Affinity Progress**: When selecting "Take important people", display current affinity progress for V/Xiaohan/Lili.

---

## 6.5. Code Module Structure

### Castle Module (`js/castle/`)

Original `castle/index.js` (1033 lines) has been split into 7 submodules by function area:

| Submodule | Function Area | Included Functions |
|-----------|---------------|--------------------|
| `castle/outpost.js` | Castle exterior + guard interaction | handleCastleOutpost, refreshCastleOutpost, handleCastleExploreBlocked, handleGuardChat, handleGuardEnter, handleGuardBribe, handleGuardLeave, handleCastleGuard, handleCastleGuardAction |
| `castle/interior.js` | Castle interior interface/explore/routing | enterCastleInterior, showCastleInterior, refreshCastleInterior, handleCastleInteriorExplore, handleCastleInteriorAction, handleLeaveCastleInterior, handleLeaveCastle |
| `castle/royalty.js` | Royal family dialogues + banquet/ball/guest room + salary | handleCastleKing, handleCastleQueen, handleCastleBanquet, handleCastleBall, handleCastleRoom, handleCastleSalary |
| `castle/services.js` | Treatment/meeting/garden/reissue/work | handleCastleTreatment, handleTreatConfirm, handleCastleMeeting, handleCastleGarden, handleCastleTitleReissue, handleCastleWork |
| `castle/king-quest.js` | Complete king quest chain | handleCastleKingQuest, checkKingQuestRequire, handleKingQuestSubmit, removeKingQuestItems |
| `castle/identity.js` | Identity apply/cancel | handleCastleIdentity, handleIdentityApply, handleIdentityCancel, refreshCastleIdentity, handleCastleIdentityAction |
| `castle/bank.js` | Bank/loan/manager interaction | handleCastleBank, handleBankLoan, handleLoanSubmit, handleBankRepay, handleBankBanker, handleBankerMercy, refreshCastleBank, handleBankerFight, handleCastleBankAction, handleCastleBankerAction |

`castle/index.js` serves as unified entry, re-exports all functions from submodules, external import paths remain unchanged.

### Game Module (`js/game/`)

Original `game.js` (1779 lines) has been split into 8 submodules by function area:

| Submodule | Function Area | Included Functions |
|-----------|---------------|--------------------|
| `game/endings.js` | Ending system | triggerEnding, checkEndingTrigger, checkEndingTriggerAfterAction, checkGoHomeEnding, handleEndingAction |
| `game/base-actions.js` | Base construction | handleBaseBuild, handleBaseBuildAction |
| `game/consumables.js` | Sleep/eat/drink/medicine | handleSleep, handleEatSelect, handleDrinkSelect, handleMedicineSelect, handleFoodAction, handleDrinkAction, handleMedicineAction, handleSelectionPhase |
| `game/navigation.js` | Map navigation | handleGoOut, handleGoHome, handleMapAction |
| `game/exploration.js` | Exploration system | handleExplore, handleExploreAction |
| `game/save.js` | Save system | handleSavePage, renderSaveSlotsAsOptions, handleSavePageAction, handleSaveConfirm |
| `game/notes.js` | Survival notes | buildSurvivalNotes, handleSurvivalNotesAction, handleSurvivalNotesDetailAction |
| `game/achievements.js` | Achievement system | tryUnlockAchievement, checkSurvivalAchievements, checkExplorationAchievements |

`game/index.js` retains main routing functions `handleChooseAction` and `handleAction`, and unified exports all functions. External import paths updated from `'./game.js'` to `'./game/index.js'`.

### Inter-module Dependencies

- `castle/outpost.js` ↔ `castle/interior.js`: Mutual imports (ES modules support runtime circular references)
- `castle/interior.js` → `castle/royalty.js`, `castle/services.js`, `castle/king-quest.js`: Routing calls
- `game/index.js` → all `game/` submodules: Main route distribution
- `game/endings.js` → `game/achievements.js`: Endings trigger achievements
- `game/navigation.js` → `game/endings.js`: Check endings when going home
- `game/exploration.js` → `game/consumables.js`, `game/navigation.js`: Consume/navigate after exploration

### How to Locate When Modifying Code

| Requirement | Modify File |
|-------------|-------------|
| Modify castle guard interaction | `castle/outpost.js` |
| Modify castle interior menu | `castle/interior.js` |
| Modify banquet/ball/guest room | `castle/royalty.js` |
| Modify treatment/meeting/garden | `castle/services.js` |
| Modify king quests | `castle/king-quest.js` |
| Modify identity apply | `castle/identity.js` |
| Modify bank/loan | `castle/bank.js` |
| Modify ending logic | `game/endings.js` |
| Modify base construction | `game/base-actions.js` |
| Modify sleep/eat/drink/medicine | `game/consumables.js` |
| Modify map navigation | `game/navigation.js` |
| Modify exploration system | `game/exploration.js` |
| Modify save system | `game/save.js` |
| Modify survival notes | `game/notes.js` |
| Modify achievement system | `game/achievements.js` |
| Modify main menu routing | `game/index.js` |

---

## 7. Quick Reference Table

| Constant Name | Data Type | Entry Count | Main Fields |
|---------------|-----------|-------------|-------------|
| `TIME_PHASES` | string[] | 8 | Time phase names |
| `FOODS` | object[] | 19 | id, name, type, hunger, hydration? |
| `FRUITS` | object[] | 11 | id, name, type, hunger, hydration |
| `DRINKS` | object[] | 12 | id, name, type, hydration, effects? |
| `MEDICINES` | object[] | 14 | id, name, type, effects{health?,infection?,crash?}, rarity |
| `NURSE_MEDICINE_POOL` | object[] | 6 | (Auto-derived from MEDICINES) |
| `CIGARETTES` | object[] | 5 | id, name, type |
| `BUILDING_MATERIALS` | object[] | 6 | id, name, type |
| `CROPS` | object[] | 15 | id, name, matureTurns, yield, seedId, seedName, hunger, hydration |
| `MELEE_WEAPONS` | object[] | 39 | id, name, type, damage, durability, rarity?, comboRate |
| `RANGED_WEAPONS` | object[] | 44 | id, name, type, damage, integrity, ammoType, critRate, rarity |
| `AMMO` | object[] | 13 | id, name, type, compatibleWith[] |
| `ZOMBIES` | object[] | 16 | id, name, hp, damage, dodge, ability[] |
| `NPCS` | object | 4 | {type: {name, hpMin, hpMax, damageMin, damageMax, hasRanged}} |
| `SURVIVOR_NPC` | object[] | 3 | id, name, desc, dialogues{}, tips[], quests{} |
| `NAMED_NPCS` | object | 5 | {key: {name, hp, damageMin?, damageMax?, damage?, hasRanged, dodgeRate}} |
| `BOSS_NAMES` | string[] | 5 | (Auto-derived from NAMED_NPCS) |
| `BACKPACK_TYPES` | object | 14 | {name: {id, name, type, capacity}} |
| `LOOT_BACKPACKS` | object[] | 14 | id, name, type, capacity, rarity |
| `MAPS` | object[] | 22 | id, name, danger, encounterRate, noZombie?, lootTable{} |
| `MAP_ACTIONS` | object | 23 | {mapId: [{text, action}]} |
| `MAP_NPC_INTROS` | object | 13 | {key: appearance/combat/leave text} |
| `OUTLAW_DIALOGUES` | string[] | 15 | Outlaw dialogue text |
| `MECHANIC_DIALOGUES` | string[] | 5 | Mechanic dialogue text |
| `WOLF_DIALOGUES` | string[] | 5 | Wolf dialogue text |
| `WAREHOUSE_GUARD_DIALOGUES` | string[] | 5 | Warehouse guard dialogue text |
| `NERVOUS_VETERAN_DIALOGUES` | string[] | 5 | Nervous veteran dialogue text |
| `CASTLE_GUARD_DIALOGUES` | string[] | 5 | Castle guard dialogue text |
| `CASTLE_KING_DIALOGUES` | string[] | 5 | Castle King dialogue text |
| `CASTLE_QUEEN_DIALOGUES` | string[] | 5 | Castle Queen dialogue text |
| `CASTLE_BANKER_DIALOGUES` | string[] | 5 | Castle Banker dialogue text |
| `CASTLE_GUARD_HIGH_DIALOGUES` | string[] | 5 | Castle guard (high rank) dialogue text |
| `CASTLE_KING_HIGH_DIALOGUES` | string[] | 5 | Castle King (high rank) dialogue text |
| `CASTLE_QUEEN_HIGH_DIALOGUES` | string[] | 5 | Castle Queen (high rank) dialogue text |
| `CASTLE_BANKER_HIGH_DIALOGUES` | string[] | 5 | Castle Banker (high rank) dialogue text |
| `CASTLE_REJECTION_DIALOGUES` | object | 3 | {npcId: rejection dialogue text} |
| `DOCTOR_INTRO` | string | 1 | Dr. Chen appearance text |
| `DOCTOR_DIALOGUES` | string[] | 5 | Dr. Chen dialogue text |
| `ZOMBIE_KING_INTRO` | string | 1 | Zombie King appearance text |
| `NURSE_ZOMBIE_INTRO` | string | 1 | Nurse Zombie appearance text |
| `LEADER_DIALOGUES` | string[] | 5 | Outpost leader dialogue text |
| `SPECIAL_ITEMS` | object | 18 | {key: {id, name, type}} |
| `CASTLE_RANKS` | object[] | 6 | id, rank, name, itemId |
| `KING_QUESTS` | object[] | 5 | id, name, desc, story, submitStory, require, reward, prereqQuest |
| `BASE_LEVELS` | object[] | 5 | name, bonus, cost{}? |
| `WAREHOUSE_LEVELS` | (object\|null)[] | 8 | {wood?, building_mat?, stone?, nails?, glass?} |
| `AFFINITY_THRESHOLDS` | object[] | 5 | min, label, stage |
| `AFFINITY_MAX` | object | 5 | {npcId: maxValue} |
| `GAME_CONSTANTS` | object | 22 groups | CRASH_MAX, INFECTION_MAX, MAX_HEALTH, TURNS_PER_DAY, SURVIVAL{}, COMBAT{}, MAP_EVENTS{}, CASTLE{}, ISLAND{}, DOCTOR{}, ROCKET{}, WEATHER{}, ENCOUNTER{}, SLEEP{}, OUTPOST{}, BASE{}, ENDINGS{}, FISHING{}, YUMO{}, LIURUYAN{}, NURSE_ZOMBIE{}, NPC{}, LOOT{}, ACHIEVEMENTS{}, TRADING{}, MAP{} |
| `TOOL_WEAPON_IDS` | string[] | 4 | Melee weapon IDs |
| `V_TRADE_AMMO_TYPES` | string[] | 11 | (Auto-derived from AMMO) |
| `TRADER_WEAPON_SHOP` | object[] | 6 | weaponId, type, costMin, costMax |
| `FIXED_LOOT_DROPS` | object | 7 | {key: {weaponId?, type?, ammoId?, ammoCount?, foodId?}} |
| `TRADE_TEMPLATES` | object[] | 4 | ammoType, ammoPerItem |
| `DEFAULT_ITEM_IDS` | object | 5 | melee, food, drink, seed, serum |
| `LILI_REWARD_MEDICINE_IDS` | string[] | 4 | Medicine IDs |
| `XIAOHAN_REWARD_FOOD_IDS` | string[] | 3 | Food IDs |
| `BUILDING_MATERIAL_NAMES` | object | 6 | (Auto-derived from BUILDING_MATERIALS) |
| `CANNED_FOOD_IDS` | string[] | 8 | Canned food IDs |
| `SURVIVAL_NOTES` | object[] | 7 | id, name, entries[{title, content}] |
| `ACHIEVEMENTS` | object[] | 19 | id, name, desc, icon |
| `ENDING_STORIES` | object | 7 | {endingId: story text} |