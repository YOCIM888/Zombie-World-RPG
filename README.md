# 🧟 Zombie World — Post-Apocalyptic Survival RPG

<p align="center">
  <strong>A pure front-end, data-driven text-based survival adventure</strong><br>
  🌐 <a href="./README_zh-CN.md">中文</a> | English
</p>

---

## 📖 About

**Zombie World** (丧尸世界) is a deep, narrative-driven post-apocalyptic survival RPG that runs entirely in your browser. Scavenge a ruined world, forge alliances or rivalries, uncover a web of conspiracies, and choose your own ending among **14 distinct paths**.

Built with a **zero-dependency pure front-end architecture**. All game data is centralized in `js/data/` — modify config files to adjust balance, add items, or expand content without touching logic code.

---

## ✨ Features

### World & Exploration
- 🗺️ **22 Maps** — From safe haven to nightmare-level zombie nest, with tiered danger ratings
- 🌦️ **7 Weather Types** — Acid rain blocks travel, heatwaves drain hydration, sandstorms deal damage
- 📝 **Dynamic Survival Notes** — In-game guidebook that unlocks progressively as you explore

### Combat & Enemies
- ⚔️ **85+ Weapons** — 39 melee + 46 ranged (bows, crossbows, pistols, SMGs, rifles, shotguns, snipers, LMGs)
- 🧟 **16 Zombie Types** — Each with unique abilities: infection, corrosion, self-destruct, summon, cloak, blind, leap…
- 💀 **13 Named BOSSes** — Ma San, Shadow, Zombie King, Giant Puppet, Sea Monster, and more

### Survival Systems
- ❤️ **6 Core Attributes** — Health, Hunger, Hydration, Infection, Sanity, Fatigue — all demand constant management
- 💊 **15+ Medicines** — Bandages, antibiotics, anti-infection serum, universal injector, improved antibody…
- 🏠 **Base Building** — 5-level base upgrades + 7-level warehouse + farming with 15 crop types
- 🎒 **Backpack Progression** — From a 15-slot pocket to a 68-slot dimensional backpack

### Factions & NPCs
- 🏰 **Doom Castle** — 6-rank nobility system, royal quests, banking, faction rivalry
- 🏕️ **Haven Outpost** — Democratic shelter with work, welfare, and a tight-knit community
- 👥 **6 Core NPCs** — Miss V (spec-ops trainer), Su Xiaohan (kindergarten teacher), Lili (weapon engineer), Mumiao (botanist), Leader, King — all with full affinity + quest chains
- 🏝️ **Island NPCs** — Yumo (exiled duke), Guyue & Linhan (royalists), with bar, street shops, bank, investment, and even a black market

### Companions
- 🤝 **Liu Ruyan** — ⏰ 30-day rescue deadline! Find her half-infected, cure her, then unlock a 4-quest university reunion chain → Elopement ending
- 🧬 **Luluwei** — The only sane zombie. Feed canned food to 150 affinity and recruit her. She proves the virus isn't always absolute death

### Economy
- 💰 **Dual Currency** — Cigarettes (universal hard currency) + Royal Coins (island/castle premium currency)
- ♻️ **Weapon Recycling** — Sell surplus weapons to Lili for cigarettes — the core economic loop
- 🎣 **Fishing System** — Daily catch limit, seafood meal crafting, fish-to-scales conversion
- 🏦 **Island Bank** — Loan up to 100 royal coins, 10-day term, compound interest
- 📈 **Investment System** — 9 investment directions, 5-day cycles, high risk high reward

### Story & Endings
- 🚀 **Rocket Quest Chain** — 3-step quest → 3 ending choices (fly solo / bring companions / let the doctor go)
- 🔪 **Old Ma's Revenge Chain** — 7-step dark conspiracy arc → Being Used ending (one of the most shocking narrative twists)
- 🧜 **Mermaid Legend** — Ancient sea creature, electric scales, deep-sea boss → Mermaid ending
- 💀 **14 Endings** — Death, Unknown Future, Power Indulgence, Shine On, New Force, Fly to Space, Hope's Flame, Stay Behind, Farming Goddess, Love & Hate, Food on a Plate, Elopement, Mermaid Legend, Being Used
- 🏆 **26 Achievements** — Track every milestone, ending, and challenge

### Quality of Life
- 💾 **Multi-Slot Saves** — Auto-save + 5 manual slots + best record tracking
- ⚙️ **Game Settings** — Click mode, input mode, music toggle
- 🎵 **Background Music** — Atmospheric soundtrack
- 🔧 **Developer Tools** — SHA-256 protected cheat code lookup & probability reference

---

## 🏗️ Architecture

### Zero-Dependency Pure Front-End

```
Zombie-World-JS-Vision/
├── index.html                    # Entry page
├── css/
│   └── style.css                 # All styles
├── js/
│   ├── main.js                   # Entry module, input binding
│   ├── config.js                 # 🎯 Data hub (re-exports from js/data/)
│   ├── state.js                  # Game state management
│   ├── combat.js                 # Combat system (melee/ranged/NPC)
│   ├── ui.js                     # UI rendering (panels, stats, inventory)
│   ├── routing.js                # Scene router
│   ├── equipment.js              # Equipment management
│   ├── trading.js                # Barter & shop logic
│   ├── base.js                   # Base building
│   ├── farming.js                # Farming & crop system
│   ├── faction.js                # Faction identity utilities
│   ├── cheats.js                 # Cheat command system (dev/testing)
│   ├── save.js                   # Legacy save compatibility
│   │
│   ├── data/                     # 📦 Data Layer (Single Source of Truth)
│   │   ├── index.js              # Barrel export
│   │   ├── utils.js              # Data utilities
│   │   ├── items/                # Consumables & materials
│   │   │   ├── foods.js, drinks.js, medicines.js
│   │   │   ├── crops.js, fish.js, seafood-meals.js
│   │   │   ├── backpacks.js, building-materials.js
│   │   │   └── cigarettes.js
│   │   ├── weapons/              # Weapons & ammo
│   │   │   ├── melee.js, ranged.js
│   │   ├── entities/             # NPCs & zombies
│   │   │   ├── npcs.js, zombies.js, zombie-pools.js
│   │   ├── maps/                 # Maps & loot tables
│   │   │   ├── maps.js, map-actions.js, map-descriptions.js
│   │   ├── dialogues/            # Dialogue scripts
│   │   │   ├── castle-dialogues.js, outpost-dialogues.js
│   │   │   ├── map-dialogues.js, story-dialogues.js
│   │   │   └── yumo-dialogues.js
│   │   ├── island/               # Island data
│   │   │   ├── bar-menu.js, street-shop.js, investment.js
│   │   └── systems/              # Game config & constants
│   │       ├── constants.js      # GAME_CONSTANTS (25+ groups)
│   │       ├── achievements.js   # 26 achievements + 14 ending stories
│   │       ├── affinity.js, castle.js
│   │       ├── base-levels.js, trading.js
│   │       └── survival-notes.js # Dynamic survival guidebook
│   │
│   ├── game/                     # 🎮 Game Logic Layer
│   │   ├── endings.js            # Ending conditions & triggers
│   │   ├── base-actions.js       # Base action handlers
│   │   ├── consumables.js        # Item use logic
│   │   ├── navigation.js         # Scene navigation
│   │   ├── exploration.js        # Map exploration logic
│   │   ├── save.js               # Save/load UI handlers
│   │   ├── notes.js              # Survival notes tracking
│   │   └── achievements.js       # Achievement tracking
│   │
│   ├── map-events/               # 🗺️ Map Event Modules (per-map)
│   │   ├── lookout.js, barn.js, village.js, campsite.js
│   │   ├── harbor.js, factory.js, electro-tank.js
│   │   ├── outlaw.js, mechanic.js, veteran.js
│   │   ├── supermarket.js, warehouse.js, police.js
│   │   ├── tunnel.js, robber.js
│   │   ├── doctor.js, rocket.js, zombie-king.js
│   │   ├── wolf.js, nurse-zombie.js, liuruyan.js
│   │   └── partner-harvest.js
│   │
│   ├── castle/                   # 🏰 Doom Castle
│   │   ├── index.js, interior.js, outpost.js
│   │   ├── royalty.js, king-quest.js
│   │   ├── identity.js, bank.js, services.js
│   │
│   ├── outpost/                  # 🏕️ Haven Outpost
│   │   ├── index.js, leader.js, menu.js
│   │   ├── work.js, assassinate.js
│   │
│   ├── npcs/                     # 👥 NPC System
│   │   ├── index.js              # Core NPC logic (chat/gift/quest/recycle/repair/cure)
│   │   ├── v.js, xiaohan.js, lili.js
│   │   ├── mumiao.js, map-npcs.js
│   │
│   └── island/                   # 🏝️ Island System
│       ├── index.js              # Island entry & routing
│       ├── fishing.js, bar.js, street.js
│       ├── invest.js, black-market.js, intel.js
│       ├── yumo.js, guyue.js, linhan.js
│
├── tools/
│   ├── index.html                # Developer tools portal
│   ├── encyclopedia.html         # Item encyclopedia
│   ├── probability.html          # Drop rate reference
│   ├── tools_data/               # CSV databases
│   │   ├── cheat_codes.csv
│   │   ├── encyclopedia_data.csv
│   │   └── probability_data.csv
│   └── devtools-auth.js          # SHA-256 auth
│
├── docs/
│   ├── 通用游戏攻略.md            # Full game guide (CN)
│   ├── 剧情路线攻略.md            # Story route guide (CN)
│   ├── 深度剧情解析.md            # Deep story analysis (CN)
│   ├── 数据维护指南.md            # Data maintenance guide (CN)
│   ├── General-Game-Guide.md     # Full game guide (EN)
│   ├── Story-Route-Guide.md      # Story route guide (EN)
│   ├── In-Depth-Story-Analysis.md # Deep story analysis (EN)
│   └── Data Maintenance Guide.md  # Data maintenance guide (EN)
│
└── public/
    ├── icon/icon.png
    └── music/backmusic.mp3
```

### Data-Driven Design

| Principle | Description |
|:----------|:------------|
| **Single Source of Truth** | All game data centralized in `js/data/`, re-exported via `config.js` |
| **Config = Content** | Modify data files → modify game content. No logic code changes needed |
| **Constant References** | Logic files import constants only — zero hardcoded values |
| **Auto-Derived** | Ammo trade pools, material name tables, and more auto-generated from source data |

### Key Config Constants

| Constant | Scope |
|:---------|:------|
| `FOODS` / `DRINKS` / `MEDICINES` / `FISH` / `SEAFOOD_MEALS` | Consumable items |
| `MELEE_WEAPONS` / `RANGED_WEAPONS` / `AMMO` | Weapons & ammunition |
| `CROPS` / `SEEDS` | Farming crops & seeds |
| `SPECIAL_ITEMS` | Quest items, identity badges, key items |
| `ZOMBIES` / `NAMED_NPCS` | Enemy & NPC stat data |
| `MAPS` | Maps, loot tables, explore actions |
| `FIXED_LOOT_DROPS` | Boss kill & event reward drops |
| `ACHIEVEMENTS` / `ENDING_STORIES` | 26 achievements + 14 ending narratives |
| `SURVIVAL_NOTES` | Dynamic in-game survival guidebook |
| `GAME_CONSTANTS` | 25+ config groups covering all game balance |

---

## 🚀 Quick Start

### Play the Game

1. Clone the repository:
```bash
git clone https://github.com/YOCIM888/Zombie-World-RPG.git
cd Zombie-World-JS-Vision
```

2. Start a local server (pick one):
```bash
# Node.js
npx serve -l 3000

# Python
python -m http.server 3000
```

3. Open `http://localhost:3000` in your browser and enter the wasteland.

### Modify Game Data

Edit any file under `js/data/`, refresh the browser — changes apply immediately. See [Data Maintenance Guide](docs/Data%20Maintenance%20Guide.md) for details.

---

## 🎮 Game Progression

```
Days 1–5   ◆ Early Survival
            ├─ Work at Haven Outpost → begging → scavenge Barn
            └─ Get basic weapons (knife → shovel → fire axe)

Days 5–15  ◆ Accumulation
            ├─ Farm safe maps for supplies & larger backpacks
            ├─ Talk to NPCs daily → build affinity
            └─ Stockpile medicines, cigarettes, serum

Days 15–30 ◆ Companions
            ├─ ⚠️ RESCUE LIU RUYAN within 30 days (3 serum needed!)
            ├─ Feed Luluwei 50–75 canned food → recruit
            └─ Miss V quest chain → Dragon Sword / UZI / M4A1

Days 30–60 ◆ Power & Economy
            ├─ Island: fishing, banking, bar, investment, black market
            ├─ Yumo's 5-quest chain (gel → research → diving → building → banquet)
            ├─ Defeat Ma San (AK47) / Shadow (GP100)
            └─ Wolf & Mermaid quest chain → Sea Monster boss

Day 60+    ◆ Endgame
            ├─ Dr. Chen trade (M700 sniper) → Rocket quest chain
            ├─ 🚀 Rocket: 3 endings (Space / Hope / Stay)
            ├─ King quest chain → Prince ending
            ├─ Leader quest chain → Captain ending
            ├─ Mumiao quests → Farming Goddess ending
            ├─ Queen quests → Love & Hate ending
            ├─ Liu Ruyan quests → Elopement ending
            ├─ Wolf/Mermaid → Mermaid Legend ending
            ├─ Ma San trap → Food ending ⚠️
            └─ Old Ma's 7-step chain → Being Used ending ⚠️
```

---

## 📚 Documentation

| Document | Language | Description |
|:---------|:---------|:------------|
| [通用游戏攻略](docs/通用游戏攻略.md) | 🇨🇳 | Complete game guide: beginner to endgame |
| [剧情路线攻略](docs/剧情路线攻略.md) | 🇨🇳 | Story routes & quest chain walkthrough |
| [深度剧情解析](docs/深度剧情解析.md) | 🇨🇳 | Deep story analysis: all characters, plotlines & endings |
| [数据维护指南](docs/数据维护指南.md) | 🇨🇳 | How to maintain game data via config files |
| [General Game Guide](docs/General-Game-Guide.md) | 🇬🇧 | Complete game guide (English) |
| [Story Route Guide](docs/Story-Route-Guide.md) | 🇬🇧 | Story routes & quest chains (English) |
| [In-Depth Story Analysis](docs/In-Depth-Story-Analysis.md) | 🇬🇧 | Deep story analysis (English) |
| [Data Maintenance Guide](docs/Data%20Maintenance%20Guide.md) | 🇬🇧 | Data maintenance reference (English) |

### Developer Tools

From the main menu, click **Game Settings → 🔧 Developer Tools** and enter password `yocim888devtools` to access:
- **Probability Reference** — Drop rates, encounter rates, loot tables
- **Item Encyclopedia** — Full item database with stats

---

## 🛠️ Development

### Add a New Item

```javascript
// js/data/items/foods.js
export const FOODS = [
  // ... existing foods
  { id: "braised_pork", name: "Braised Pork", type: "food", hunger: 50, hydration: 10 },
];
```

The cheat system auto-supports new items: `/get_food_braised_pork_10`

### Adjust Game Balance

```javascript
// js/data/systems/constants.js
export const GAME_CONSTANTS = {
  SURVIVAL: {
    HUNGER_DECAY: 4,        // Hunger lost per turn
    HYDRATION_DECAY: 4,     // Hydration lost per turn
  },
  COMBAT: {
    FLEE_RATE: 0.25,        // Base flee success chance
    RANGED_DODGE_RATE: 0.6, // Ranged combat dodge chance
  },
};
```

### Modify Boss Drops

```javascript
// js/data/systems/trading.js → FIXED_LOOT_DROPS
export const FIXED_LOOT_DROPS = {
  outlaw_kill: { weaponId: "AK47", type: "ranged", ammoId: "7.62×39mm", ammoCount: 30 },
};
```

---

## 📄 License

ISC

---

> 🌟 *In the apocalypse, staying alive is the only victory.*
