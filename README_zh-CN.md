# 🧟 丧尸世界 — 末日生存文字 RPG

<p align="center">
  <strong>一个纯前端、数据驱动的深度叙事末日生存游戏</strong><br>
  🌐 中文 | <a href="./README.md">English</a>
</p>

---

## 📖 项目简介

**丧尸世界** 是一款深度叙事向的浏览器末日生存 RPG。在丧尸横行的废土中，你将搜集物资、锻造武器、结交盟友或树敌、揭开层层阴谋，并在 **14 种不同结局** 中选择自己的命运。

游戏采用 **零依赖纯前端架构**，所有游戏数据集中在 `js/data/` 目录管理。修改配置文件即可调整游戏平衡、新增物品和扩展内容，无需改动逻辑代码。

---

## ✨ 游戏特色

### 世界与探索
- 🗺️ **22 张地图** — 从安全的曙光阵地到炼狱级丧尸巢穴，六级难度递进
- 🌦️ **7 种天气** — 酸雨禁止出行，酷暑加速脱水，沙暴持续扣血
- 📝 **动态生存笔记** — 随探索进度逐步解锁的内置攻略手册

### 战斗与敌人
- ⚔️ **85+ 把武器** — 39 把近战 + 46 把远程（弓弩、手枪、冲锋枪、步枪、霰弹枪、狙击枪、轻机枪）
- 🧟 **16 种丧尸** — 各具特殊能力：感染、腐蚀、自爆、召唤、隐身、致盲、飞跃……
- 💀 **13 个命名 BOSS** — 马三、黑影、尸王·寂灭、巨型傀儡、巨型海尸等

### 生存系统
- ❤️ **六大核心属性** — 生命、饱腹、水分、感染、理智、疲惫——需要持续管理
- 💊 **15+ 种药品** — 创可贴、抗生素、抗感染血清、万能针剂、改良抗体针……
- 🏠 **基地建设** — 5 级基地升级 + 7 级仓库 + 15 种作物的种植系统
- 🎒 **背包进阶** — 从 15 格口袋到 68 格次元收纳背包

### 阵营与 NPC
- 🏰 **末日城堡** — 6 级爵位体系、皇家任务、银行借贷、阵营对抗
- 🏕️ **曙光阵地** — 民主避难所：打工、福利、紧密的社群羁绊
- 👥 **6 大核心 NPC** — V 小姐（特种兵教官）、苏小涵（幼儿园老师）、莉莉丝（武器工程师）、沐苗苗（植物学博士）、阵地首领、国王——全部拥有完整好感度系统与任务链
- 🏝️ **岛屿 NPC** — 余墨公爵（被流放的贵族）、顾月与林寒（保皇派岛民），配套酒吧、商铺、银行、投资、黑市

### 伙伴系统
- 🤝 **柳如烟** — ⏰ 30 天救援倒计时！在商场发现半感染的她，用 3 支血清救回，解锁 4 段大学校园怀旧任务链 → 私奔结局
- 🧬 **露露薇** — 全游戏唯一保留理智的丧尸护士。投喂 50~75 个罐头至 150 好感招募。她证明了丧尸化并非绝对的死刑

### 经济系统
- 💰 **双货币体系** — 香烟（通用硬通货）+ 皇家币（岛屿/城堡高端货币）
- ♻️ **武器回收** — 将多余武器卖给莉莉丝换取香烟——核心经济循环
- 🎣 **钓鱼系统** — 每日上限、海鲜料理制作、鱼类→鳞片转换
- 🏦 **岛屿银行** — 最高借款 100 皇家币，10 天期限，复利计息
- 📈 **投资系统** — 9 种投资方向，5 天周期，高风险高回报

### 剧情与结局
- 🚀 **火箭任务链** — 3 段任务 → 3 种结局选择（独自飞走 / 带上伙伴 / 让博士离开）
- 🔪 **老马复仇链** — 7 步黑暗阴谋线 → 被人当枪使结局（全游戏最震撼的叙事陷阱之一）
- 🧜 **人鱼传说** — 远古深海生物、电流鳞片、巨型海尸 BOSS → 人鱼结局
- 💀 **14 种结局** — 死亡 / 未知的将来 / 权力的沉溺 / 发光发热吧 / 成为新势力 / 飞向太空 / 希望的火种 / 留下来吧 / 我不是农神 / 爱恨情仇 / 沦为盘中餐 / 私奔 / 人鱼传说 / 被人当枪使
- 🏆 **26 个成就** — 追踪每一个里程碑、结局和挑战

### 便捷功能
- 💾 **多存档位** — 自动存档 + 5 个手动槽位 + 最佳记录追踪
- ⚙️ **游戏设置** — 点击模式、输入模式、音乐开关
- 🎵 **背景音乐** — 沉浸式氛围配乐
- 🔧 **开发者工具** — SHA-256 保护的作弊码查询与概率参考

---

## 🏗️ 技术架构

### 纯前端、零依赖

```
Zombie-World-JS-Vision/
├── index.html                    # 入口页面
├── css/
│   └── style.css                 # 全局样式
├── js/
│   ├── main.js                   # 入口模块，输入绑定
│   ├── config.js                 # 🎯 数据中心（汇总 re-export）
│   ├── state.js                  # 游戏状态管理
│   ├── combat.js                 # 战斗系统（近战/远程/NPC战斗）
│   ├── ui.js                     # UI 渲染（面板、状态、背包、选项）
│   ├── routing.js                # 场景路由分发
│   ├── equipment.js              # 装备管理
│   ├── trading.js                # 交易与商店逻辑
│   ├── base.js                   # 基地建设
│   ├── farming.js                # 种植系统
│   ├── faction.js                # 阵营身份工具
│   ├── cheats.js                 # 作弊指令系统
│   ├── save.js                   # 旧版存档兼容
│   │
│   ├── data/                     # 📦 数据层（唯一数据源）
│   │   ├── index.js              # 汇总导出
│   │   ├── utils.js              # 数据工具函数
│   │   ├── items/                # 消耗品与材料数据
│   │   │   ├── foods.js, drinks.js, medicines.js
│   │   │   ├── crops.js, fish.js, seafood-meals.js
│   │   │   ├── backpacks.js, building-materials.js
│   │   │   └── cigarettes.js
│   │   ├── weapons/              # 武器与弹药
│   │   │   ├── melee.js, ranged.js
│   │   ├── entities/             # NPC 与丧尸数据
│   │   │   ├── npcs.js, zombies.js, zombie-pools.js
│   │   ├── maps/                 # 地图与掉落表
│   │   │   ├── maps.js, map-actions.js, map-descriptions.js
│   │   ├── dialogues/            # 对话剧本
│   │   │   ├── castle-dialogues.js, outpost-dialogues.js
│   │   │   ├── map-dialogues.js, story-dialogues.js
│   │   │   └── yumo-dialogues.js
│   │   ├── island/               # 岛屿数据
│   │   │   ├── bar-menu.js, street-shop.js, investment.js
│   │   └── systems/              # 系统配置
│   │       ├── constants.js      # GAME_CONSTANTS（25+ 配置组）
│   │       ├── achievements.js   # 26 成就 + 14 结局文本
│   │       ├── affinity.js, castle.js
│   │       ├── base-levels.js, trading.js
│   │       └── survival-notes.js # 动态生存笔记
│   │
│   ├── game/                     # 🎮 游戏逻辑层
│   │   ├── endings.js            # 结局条件与触发
│   │   ├── base-actions.js       # 基地操作处理
│   │   ├── consumables.js        # 物品使用逻辑
│   │   ├── navigation.js         # 场景导航
│   │   ├── exploration.js        # 地图探索逻辑
│   │   ├── save.js               # 存档 UI 处理
│   │   ├── notes.js              # 生存笔记追踪
│   │   └── achievements.js       # 成就追踪
│   │
│   ├── map-events/               # 🗺️ 地图事件（按地图拆分）
│   │   ├── lookout.js, barn.js, village.js, campsite.js
│   │   ├── harbor.js, factory.js, electro-tank.js
│   │   ├── outlaw.js, mechanic.js, veteran.js
│   │   ├── supermarket.js, warehouse.js, police.js
│   │   ├── tunnel.js, robber.js
│   │   ├── doctor.js, rocket.js, zombie-king.js
│   │   ├── wolf.js, nurse-zombie.js, liuruyan.js
│   │   └── partner-harvest.js
│   │
│   ├── castle/                   # 🏰 末日城堡
│   │   ├── index.js, interior.js, outpost.js
│   │   ├── royalty.js, king-quest.js
│   │   ├── identity.js, bank.js, services.js
│   │
│   ├── outpost/                  # 🏕️ 曙光阵地
│   │   ├── index.js, leader.js, menu.js
│   │   ├── work.js, assassinate.js
│   │
│   ├── npcs/                     # 👥 NPC 系统
│   │   ├── index.js              # NPC 核心逻辑（对话/送礼/任务/回收/修理/治疗）
│   │   ├── v.js, xiaohan.js, lili.js
│   │   ├── mumiao.js, map-npcs.js
│   │
│   └── island/                   # 🏝️ 岛屿系统
│       ├── index.js              # 岛屿入口与路由
│       ├── fishing.js, bar.js, street.js
│       ├── invest.js, black-market.js, intel.js
│       ├── yumo.js, guyue.js, linhan.js
│
├── tools/
│   ├── index.html                # 开发者工具入口
│   ├── encyclopedia.html         # 图鉴百科
│   ├── probability.html          # 概率查询
│   ├── tools_data/               # CSV 数据库
│   │   ├── cheat_codes.csv
│   │   ├── encyclopedia_data.csv
│   │   └── probability_data.csv
│   └── devtools-auth.js          # SHA-256 验证
│
├── docs/
│   ├── 通用游戏攻略.md            # 完整游戏攻略（从新手到终局）
│   ├── 剧情路线攻略.md            # 剧情路线与任务链攻略
│   ├── 深度剧情解析.md            # 深度剧情解析（全角色、全剧情、全结局）
│   ├── 数据维护指南.md            # 数据驱动维护指南
│   ├── General-Game-Guide.md      # 英文：完整游戏攻略
│   ├── Story-Route-Guide.md       # 英文：剧情路线攻略
│   ├── In-Depth-Story-Analysis.md # 英文：深度剧情解析
│   └── Data Maintenance Guide.md  # 英文：数据维护指南
│
└── public/
    ├── icon/icon.png
    └── music/backmusic.mp3
```

### 数据驱动设计

| 原则 | 说明 |
|:-----|:-----|
| **唯一数据源** | 所有游戏数据集中在 `js/data/`，通过 `config.js` 统一导出 |
| **配置即内容** | 修改数据文件 = 修改游戏内容，无需改逻辑代码 |
| **常量引用** | 逻辑文件只导入常量——零硬编码 |
| **自动派生** | 弹药交易池、建材名称表等从源数据自动生成 |

### 关键配置常量

| 常量 | 覆盖范围 |
|:-----|:---------|
| `FOODS` / `DRINKS` / `MEDICINES` / `FISH` / `SEAFOOD_MEALS` | 消耗品数据 |
| `MELEE_WEAPONS` / `RANGED_WEAPONS` / `AMMO` | 武器与弹药 |
| `CROPS` / `SEEDS` | 作物与种子 |
| `SPECIAL_ITEMS` | 任务道具、身份牌、关键物品 |
| `ZOMBIES` / `NAMED_NPCS` | 敌人与 NPC 属性 |
| `MAPS` | 地图、掉落表、探索行动 |
| `FIXED_LOOT_DROPS` | BOSS 击杀与事件奖励掉落 |
| `ACHIEVEMENTS` / `ENDING_STORIES` | 26 个成就 + 14 个结局叙事文本 |
| `SURVIVAL_NOTES` | 动态内置生存指南 |
| `GAME_CONSTANTS` | 25+ 配置组覆盖全部游戏平衡参数 |

### GAME_CONSTANTS 主要分组

| 分组 | 用途 |
|:-----|:-----|
| `SURVIVAL` | 饥饿/水分/疲惫/理智衰减参数 |
| `COMBAT` | 战斗倍率/逃跑/远程闪避/特殊能力 |
| `CASTLE` | 爵位/银行/身份/服务 |
| `ISLAND` | 岛屿银行/休息/贷款 |
| `ROCKET` | 火箭任务链（能源/药品/食物/好感需求） |
| `DOCTOR` | 博士治疗/血清交易 |
| `WEATHER` | 天气概率与效果 |
| `OUTPOST` | 阵地打工/荣誉武器 |
| `BASE` | 基地升级/仓库/种植 |
| `FISHING` | 钓鱼上限/海鲜加工 |
| `YUMO` | 余墨公爵任务链参数 |
| `LIURUYAN` | 柳如烟救援时限 |
| `NURSE_ZOMBIE` | 露露薇招募参数 |
| `NPC` | NPC 好感/交易/修理 |
| `ENDINGS` | 结局触发条件 |
| `ACHIEVEMENTS` | 成就阈值 |

---

## 🚀 快速开始

### 运行游戏

1. 克隆项目：
```bash
git clone https://github.com/YOCIM888/Zombie-World-RPG.git
cd Zombie-World-JS-Vision
```

2. 启动本地服务器（任选一种）：
```bash
# Node.js
npx serve -l 3000

# Python
python -m http.server 3000
```

3. 浏览器打开 `http://localhost:3000`，输入角色名，进入末日世界。

### 修改游戏数据

编辑 `js/data/` 下任意数据文件，刷新浏览器即可生效。详见 [数据维护指南](docs/数据维护指南.md)。

---

## 🎮 游戏流程概览

```
第 1~5 天   ◆ 开局求生
             ├─ 曙光阵地打工 + 乞讨 → 谷仓搜刮
             └─ 获取基础武器（匕首 → 铁铲 → 消防斧）

第 5~15 天  ◆ 积累期
             ├─ 刷安全地图攒物资 → 找大背包
             ├─ 每日对话 NPC → 积累好感
             └─ 囤积药品、香烟、血清

第 15~30 天 ◆ 伙伴招募
             ├─ ⚠️ 30 天内救柳如烟（需要 3 支血清！）
             ├─ 投喂露露薇 50~75 个罐头 → 招募
             └─ V 小姐任务链 → 龙抄剑 / UZI / M4A1

第 30~60 天 ◆ 力量与经济
             ├─ 岛屿探索：钓鱼、银行、酒吧、投资、黑市
             ├─ 余墨公爵 5 段任务链（凝胶→研究→潜水→建设→庆功宴）
             ├─ 挑战马三（AK47）/ 黑影（GP100）
             └─ 老狼与人鱼任务链 → 巨型海尸 BOSS

第 60 天+   ◆ 终局挑战
             ├─ 陈博士交易（M700 狙击枪）→ 火箭任务链
             ├─ 🚀 火箭：3 种结局（飞向太空 / 希望的火种 / 留下来吧）
             ├─ 国王任务链 → 权力沉溺结局
             ├─ 首领任务链 → 发光发热吧结局
             ├─ 沐苗苗任务链 → 我不是农神结局
             ├─ 皇后任务链 → 爱恨情仇结局
             ├─ 柳如烟任务链 → 私奔结局
             ├─ 老狼+人鱼 → 人鱼传说结局
             ├─ 马三陷阱 → 沦为盘中餐结局 ⚠️
             └─ 老马 7 步暗杀链 → 被人当枪使结局 ⚠️
```

---

## 📚 文档索引

| 文档 | 语言 | 说明 |
|:-----|:-----|:-----|
| [通用游戏攻略](docs/通用游戏攻略.md) | 🇨🇳 | 完整游戏攻略：从新手到终局 |
| [剧情路线攻略](docs/剧情路线攻略.md) | 🇨🇳 | 剧情路线与任务链全解 |
| [深度剧情解析](docs/深度剧情解析.md) | 🇨🇳 | 深度剧情解析：全角色、全剧情、全结局 |
| [数据维护指南](docs/数据维护指南.md) | 🇨🇳 | 如何通过修改配置文件维护游戏数据 |
| [General Game Guide](docs/General-Game-Guide.md) | 🇬🇧 | 英文：完整游戏攻略 |
| [Story Route Guide](docs/Story-Route-Guide.md) | 🇬🇧 | 英文：剧情路线攻略 |
| [In-Depth Story Analysis](docs/In-Depth-Story-Analysis.md) | 🇬🇧 | 英文：深度剧情解析 |
| [Data Maintenance Guide](docs/Data%20Maintenance%20Guide.md) | 🇬🇧 | 英文：数据维护参考 |

### 开发者工具

主菜单点击 **游戏设置 → 🔧 开发者工具**，输入密码 `yocim888devtools` 即可访问：
- **概率查询** — 掉落率、遭遇率、搜刮表一览
- **图鉴百科** — 全部物品属性数据库

---

## 🛠️ 开发指南

### 新增物品

```javascript
// js/data/items/foods.js
export const FOODS = [
  // ... 现有食物
  { id: "braised_pork", name: "红烧肉", type: "food", hunger: 50, hydration: 10 },
];
```

作弊系统自动支持新物品：`/get_food_红烧肉_10`

### 调整游戏平衡

```javascript
// js/data/systems/constants.js
export const GAME_CONSTANTS = {
  SURVIVAL: {
    HUNGER_DECAY: 4,        // 每回合饥饿衰减
    HYDRATION_DECAY: 4,     // 每回合水分衰减
  },
  COMBAT: {
    FLEE_RATE: 0.25,        // 基础逃跑成功率
    RANGED_DODGE_RATE: 0.6, // 远程战斗闪避率
  },
};
```

### 修改 BOSS 掉落

```javascript
// js/data/systems/trading.js → FIXED_LOOT_DROPS
export const FIXED_LOOT_DROPS = {
  outlaw_kill: { weaponId: "AK47", type: "ranged", ammoId: "7.62×39mm", ammoCount: 30 },
};
```

---

## 📄 许可证

ISC

---

> 🌟 *末世之中，活着就是胜利。*
