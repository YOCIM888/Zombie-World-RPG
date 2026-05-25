import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addNpcAffinity,
  getNpcAffinity,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getBackpackCount,
  removeGasoline,
} from '../state.js';

import {
  WOLF_DIALOGUES,
  GAME_CONSTANTS,
  MEDICINES,
  MAP_NPC_INTROS,
  SPECIAL_ITEMS,
  MELEE_WEAPONS,
  RANGED_WEAPONS,
  AMMO,
  NAMED_NPCS,
  weightedRandom,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { triggerEnding } from '../game/endings.js';

/* ============================================================
   老狼 - 对话 / 交易（保持原有逻辑）
   ============================================================ */

export function handleWolfInteract() {
  setPhase("explore");
  setStory(MAP_NPC_INTROS.wolf_intro);
  setOptions(buildWolfOptions());
}

export function handleWolfChat() {
  setPhase("explore");
  const line = WOLF_DIALOGUES[Math.floor(Math.random() * WOLF_DIALOGUES.length)];
  setStory(line);
  setOptions(buildWolfOptions());
}

export function handleWolfLeave() {
  setStory("你和老狼告别，离开了居民区。");
  showExploreOptionsState();
}

export function handleWolfTrade() {
  const state = getState();
  if (state.lastWolfTradeDay >= state.day) {
    setStory("今天已经和老狼交易过了，明天再来吧。");
    handleWolfInteract();
    return;
  }
  const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
  if (foodCount < GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST) {
    setStory(`老狼瞥了你一眼："就这点吃的还想换东西？至少${GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST}份食物。"你只有${foodCount}份。`);
    handleWolfInteract();
    return;
  }
  if (getBackpackCount() - GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST + 1 > state.backpack.capacity) {
    setStory("背包空间不足，无法完成交易。");
    handleWolfInteract();
    return;
  }
  const removedItems = [];
  let remaining = GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    const available = state.food[i].count || 1;
    if (available <= remaining) {
      removedItems.push(state.food[i]);
      state.food.splice(i, 1);
      remaining -= available;
    } else {
      removedItems.push({ ...state.food[i], count: remaining });
      state.food[i].count = available - remaining;
      remaining = 0;
    }
  }
  const laolangMeds = MEDICINES.filter(m => m.rarity === "common" || m.rarity === "uncommon" || m.rarity === "rare");
  const rarityWeights = GAME_CONSTANTS.LOOT.RARITY_WEIGHTS;
  const med = weightedRandom(laolangMeds, m => rarityWeights[m.rarity] || 1);
  const added = addItem({ ...med, type: "medicine" });
  const foodNames = removedItems.map(f => f.name).join("、");
  if (added) {
    setStory(`你用${foodNames}与老狼交换了一盒${med.name}。老狼接过食物，迫不及待地啃了起来。`);
  } else {
    setStory(`你用${foodNames}与老狼交换了一盒${med.name}，但背包已满，药品掉在了地上！`);
  }
  state.lastWolfTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

/* ============================================================
   选项构建辅助
   ============================================================ */

function buildWolfOptions() {
  const state = getState();
  const opts = [
    { text: "对话", action: "wolf_chat" },
    { text: "以物易物", action: "wolf_trade" },
  ];

  // 任务一：鳞片收集
  if (!state.wolfQuest1Done) {
    opts.push({ text: "任务：鳞片收集", action: "wolf_quest1" });
  }

  // 任务二：收藏家
  if (state.wolfQuest1Done && !state.wolfQuest2Done) {
    opts.push({ text: "任务：收藏家", action: "wolf_quest2" });
  }

  // 任务三：出海前的准备
  const mermaidAff = getNpcAffinity("mermaid");
  if (state.wolfQuest2Done && !state.wolfQuest3Done && mermaidAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
    opts.push({ text: "任务：出海前的准备", action: "wolf_quest3" });
  }

  // 任务四：巨型海尸
  if (state.wolfQuest3Done && !state.wolfQuest4Done) {
    opts.push({ text: "任务：巨型海尸", action: "wolf_quest4" });
  }

  opts.push({ text: "离开", action: "wolf_leave" });
  return opts;
}

/* ============================================================
   任务一：鳞片收集 - 提交5个闪电鳞片
   ============================================================ */

export function handleWolfQuest1() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST1_SCALE_COST;

  setPhase("explore");
  setStory(
    `老狼眯起眼睛，若有所思地看着你："小伙子，听说过'闪电鳞片'这种东西吗？\n` +
    `据说只有在带电的水域中，由某种特殊的鱼才能产出。我最近在研究这些东西，\n` +
    `如果你能帮我弄到${cost}片闪电鳞片，我欠你一个人情。\n\n` +
    `（提示：也许可以去商场的漏电玻璃缸那里试试）`
  );

  const lightningItem = state.other.find(i => i.id === "lightning_scale");
  const lightningCount = lightningItem ? (lightningItem.count || 1) : 0;

  setOptions([
    {
      text: `提交${cost}个闪电鳞片（当前拥有：${lightningCount}）`,
      action: "wolf_quest1_submit",
      disabled: lightningCount < cost,
    },
    { text: "返回", action: "wolf_interact" },
  ]);
}

export function handleWolfQuest1Submit() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST1_SCALE_COST;

  let remaining = cost;
  const lightningItem = state.other.find(i => i.id === "lightning_scale");
  if (lightningItem) {
    const available = lightningItem.count || 1;
    if (available <= remaining) {
      remaining -= available;
      const idx = state.other.indexOf(lightningItem);
      if (idx !== -1) state.other.splice(idx, 1);
    } else {
      lightningItem.count = available - remaining;
      remaining = 0;
    }
  }

  if (remaining > 0) {
    setStory("闪电鳞片数量不足，老狼摇了摇头。");
    handleWolfInteract();
    return;
  }

  state.wolfQuest1Done = true;
  addNpcAffinity("wolf", 10);

  setStory(
    `你将${cost}片闪电鳞片交到老狼手中。\n\n` +
    `老狼仔细端详着这些闪烁着电弧的鳞片，眼中闪过一丝惊讶：\n` +
    `"好家伙……这玩意儿比我预想的还要厉害。这些鳞片里蕴含的能量，\n` +
    `绝对不是这末世里该有的东西。"\n\n` +
    `他小心地将鳞片收进怀里，压低声音说道：\n` +
    `"其实……我一直在研究更深层的东西。传说深海中有一种生物，\n` +
    `它们的鳞片蕴含着雷霆之力。而这些闪电鳞片，只是最初级的产物……\n` +
    `如果你能弄到更高级的'通雷鳞片'，记得来找我。"\n\n` +
    `✅ 任务"鳞片收集"完成！老狼好感度 +10。`
  );

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleWolfInteract();
  }
}

/* ============================================================
   任务二：收藏家 - 提交3个通雷鳞片
   ============================================================ */

export function handleWolfQuest2() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST2_SCALE_COST;

  setPhase("explore");
  setStory(
    `老狼从怀里掏出一本破旧的笔记本，上面画满了各种奇怪的符号和图案。\n` +
    `"通雷鳞片——我查了很多古籍才找到这个名字。" 他指着笔记本上的一张草图，\n` +
    `"这种鳞片比闪电鳞片强大得多，据说产自传说中的深渊鱼类。\n` +
    `如果你能帮我弄到${cost}片，我就告诉你一个秘密——\n` +
    `关于这个小区物业仓库里藏着的东西。"`
  );

  const thunderItem = state.other.find(i => i.id === "thunder_scale");
  const thunderCount = thunderItem ? (thunderItem.count || 1) : 0;

  setOptions([
    {
      text: `提交${cost}个通雷鳞片（当前拥有：${thunderCount}）`,
      action: "wolf_quest2_submit",
      disabled: thunderCount < cost,
    },
    { text: "返回", action: "wolf_interact" },
  ]);
}

export function handleWolfQuest2Submit() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST2_SCALE_COST;

  let remaining = cost;
  const thunderItem = state.other.find(i => i.id === "thunder_scale");
  if (thunderItem) {
    const available = thunderItem.count || 1;
    if (available <= remaining) {
      remaining -= available;
      const idx = state.other.indexOf(thunderItem);
      if (idx !== -1) state.other.splice(idx, 1);
    } else {
      thunderItem.count = available - remaining;
      remaining = 0;
    }
  }

  if (remaining > 0) {
    setStory("通雷鳞片数量不足，老狼叹了口气。");
    handleWolfInteract();
    return;
  }

  state.wolfQuest2Done = true;
  addNpcAffinity("wolf", 15);

  setStory(
    `你郑重地将${cost}片通雷鳞片放到老狼手中。\n\n` +
    `鳞片在接触老狼手掌的瞬间，迸发出一道细微的雷光。老狼的手微微颤抖——\n` +
    `不是被电的，而是激动。\n\n` +
    `"果然……果然是真的！" 他深吸一口气，将鳞片用一块破布仔细包裹好。\n` +
    `"听好了，小伙子。物业仓库那边……有个受伤的人鱼。\n` +
    `她被困在那里很久了，我不敢让任何人靠近她。\n` +
    `但现在，你证明了你的诚意——你可以去看看她了。\n` +
    `带上你的鳞片，也许……你能帮到她。"\n\n` +
    `✅ 任务"收藏家"完成！老狼好感度 +15。\n` +
    `🔓 老旧居民小区的【物业仓库】现已开放！`
  );

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleWolfInteract();
  }
}

/* ============================================================
   任务三：出海前的准备 —— 提交5汽油+5任意食物+5任意饮品
   奖励：沙漠之鹰 + 30发.50 AE
   ============================================================ */

export function handleWolfQuest3() {
  const state = getState();

  setPhase("explore");
  setStory(
    `老狼站在窗边，望着远方海的方向，神色凝重。\n\n` +
    `"人鱼告诉了我一些事情……深海中有个大家伙，比我们见过的任何丧尸都要可怕。\n` +
    `如果不管它，迟早会威胁到整个海岸线。"\n\n` +
    `他转过身，目光坚定："我准备出海，去会会那个怪物。但我需要补给——\n` +
    `${GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST}桶汽油、${GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST}份食物、${GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST}份饮品。\n` +
    `不会让你白忙活的，事成之后，我珍藏多年的家伙归你。"`
  );

  const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
  const drinksCount = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);

  const canSubmit =
    state.gasoline >= GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST &&
    foodCount >= GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST &&
    drinksCount >= GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST;

  setOptions([
    {
      text: `提交物资（汽油:${state.gasoline}/${GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST} 食物:${foodCount}/${GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST} 饮品:${drinksCount}/${GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST}）`,
      action: "wolf_quest3_submit",
      disabled: !canSubmit,
    },
    { text: "返回", action: "wolf_interact" },
  ]);
}

export function handleWolfQuest3Submit() {
  const state = getState();

  // 扣除汽油
  removeGasoline(GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST);

  // 扣除食物
  let foodRemaining = GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST;
  for (let i = state.food.length - 1; i >= 0 && foodRemaining > 0; i--) {
    const available = state.food[i].count || 1;
    if (available <= foodRemaining) {
      state.food.splice(i, 1);
      foodRemaining -= available;
    } else {
      state.food[i].count = available - foodRemaining;
      foodRemaining = 0;
    }
  }

  // 扣除饮品
  let drinksRemaining = GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST;
  for (let i = state.drinks.length - 1; i >= 0 && drinksRemaining > 0; i--) {
    const available = state.drinks[i].count || 1;
    if (available <= drinksRemaining) {
      state.drinks.splice(i, 1);
      drinksRemaining -= available;
    } else {
      state.drinks[i].count = available - drinksRemaining;
      drinksRemaining = 0;
    }
  }

  // 奖励
  const deagle = RANGED_WEAPONS.find(w => w.id === GAME_CONSTANTS.WOLF.QUEST3_REWARD_DEAGLE);
  const deagleItem = deagle ? { ...deagle } : null;
  if (deagleItem) addItem(deagleItem);

  const ammoItem = {
    id: GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO,
    name: GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO,
    type: "ammo",
    count: GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO_COUNT,
  };
  addItem(ammoItem);

  state.wolfQuest3Done = true;
  addNpcAffinity("wolf", 20);

  setStory(
    `你将从各处搜刮来的物资堆在老狼面前：\n` +
    `${GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST}桶汽油、${GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST}份食物、${GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST}份饮品。\n\n` +
    `老狼沉默了好一会儿，然后从床底拖出一个油布包裹的长条箱子。\n` +
    `"拿着。" 他打开箱子——一把保养得锃亮的沙漠之鹰躺在里面，\n` +
    `旁边整齐码放着${GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO_COUNT}发.50 AE大口径子弹。\n\n` +
    `"这是我年轻时在黑市花了血本弄来的。射程远、威力大，\n` +
    `对付那个深海的怪物，应该能派上用场。"\n\n` +
    `他拍拍你的肩膀："准备好了就来找我。真正的对手，在深海下面。"\n\n` +
    `✅ 任务"出海前的准备"完成！老狼好感度 +20。\n` +
    `🎁 获得：${deagleItem ? deagleItem.name : "沙漠之鹰"}×1 + ${GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO}×${GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO_COUNT}`
  );

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleWolfInteract();
  }
}

/* ============================================================
   任务四：巨型海尸 —— 只能远程攻击的BOSS战
   胜利 → 结局十三 "人鱼传说"
   失败 → 死亡
   ============================================================ */

export function handleWolfQuest4() {
  const state = getState();

  if (!state.rangedWeapon) {
    setStory(
      `老狼看着你空空的双手，皱起了眉头：\n` +
      `"你没带远程武器？那可是深海里的怪物，近战根本碰不到它！\n` +
      `去装备一把远程武器，带足弹药再来找我。"`
    );
    handleWolfInteract();
    return;
  }

  const ammoId = state.rangedWeapon.ammoType;
  const ammo = state.ammo.find(a => a.id === ammoId);
  if (!ammo || ammo.count <= 0) {
    setStory(
      `老狼看了看你的${state.rangedWeapon.name}：\n` +
      `"枪是好枪，但你没带弹药！快去补充些${ammoId}再来。"`
    );
    handleWolfInteract();
    return;
  }

  setPhase("explore");
  setStory(
    `老狼带你来港口边的一艘破旧渔船旁。海面阴沉，铅灰色的云层压得极低。\n\n` +
    `"那个家伙……就在这片海域下面。" 老狼的声音低沉而凝重。\n` +
    `"巨大得不像这个世界的生物。人鱼说，它沉睡了几百年，\n` +
    `是末日的能量把它唤醒了。"\n\n` +
    `远处，一只雪白的手臂从船舷边探出——是受伤的人鱼。\n` +
    `她的鳞片在阴暗的海面上泛着微光，眼神中既有恐惧，也有决绝。\n\n` +
    `"准备好了吗？" 老狼握紧了猎枪。\n` +
    `"这一战，要么把怪物送回深渊……要么我们全都葬身鱼腹。"\n\n` +
    `⚠ 巨型海尸只能通过远程武器攻击，近战无效！`
  );

  setOptions([
    { text: "出海迎战（远程作战·不可逆转！）", action: "wolf_quest4_fight" },
    { text: "暂时撤退", action: "wolf_quest4_retreat" },
  ]);
}

export function handleWolfQuest4Retreat() {
  setStory("你暂时放弃了出海的念头。老狼默默点了点头：\"准备充分再来，不急。\"");
  handleWolfInteract();
}

export function handleWolfQuest4Fight() {
  const state = getState();

  // 再次检查远程武器
  if (!state.rangedWeapon) {
    setStory("你没有装备远程武器，无法与深海怪物战斗！");
    handleWolfInteract();
    return;
  }

  const ammoId = state.rangedWeapon.ammoType;
  const ammo = state.ammo.find(a => a.id === ammoId);
  if (!ammo || ammo.count <= 0) {
    setStory("你没有弹药，无法战斗！");
    handleWolfInteract();
    return;
  }

  // 创建BOSS
  const bossDef = NAMED_NPCS.sea_monster;
  if (!bossDef) {
    setStory("【错误】BOSS数据未定义，请联系开发者。");
    handleWolfInteract();
    return;
  }

  const npc = {
    type: "sea_monster",
    name: bossDef.name,
    hp: bossDef.hp,
    maxHp: bossDef.hp,
    damage: bossDef.damage || 60,
    hasRanged: false,
    dodgeRate: bossDef.dodgeRate || 0.1,
  };

  state._pendingNpc = npc;
  state._wolfQuest4Combat = true;

  setPhase("pre_combat_npc");
  setStory(
    `渔船驶入了深海区域。海面突然剧烈翻涌——\n\n` +
    `一个巨大的黑影从深海中缓缓升起。那是一个难以名状的生物：\n` +
    `腐烂的鲸鱼般的身躯上覆盖着漆黑的鳞甲，数十条触手从身体两侧伸出，\n` +
    `每条触手末端都长着一只发着幽光的眼睛。\n\n` +
    `"就是它！" 老狼大吼一声。受伤的人鱼发出了一声奇异而悲怆的吟唱，\n` +
    `一道微弱的屏障笼罩了渔船——那是她能提供的最后一点庇护。\n\n` +
    `【巨型海尸】HP:${npc.hp} 伤害:${npc.damage}\n` +
    `⚠ 此怪物只能用远程武器攻击！\n\n` +
    `【近战】${state.meleeWeapon.name}\n` +
    `【远程】${state.rangedWeapon.name} (弹药:${ammo ? ammo.count : 0}发 完整:${state.rangedWeapon.integrity}%)`
  );

  const options = [
    { text: "远程作战", action: "combat_npc_ranged" },
    { text: "近战作战（无效！无法触及深海怪物）", action: "combat_npc_melee", disabled: true },
    { text: "撤退（25%）", action: "combat_npc_flee" },
  ];
  setOptions(options);
}

/* ============================================================
   物业仓库 - 老旧居民小区常驻选项
   ============================================================ */

export function handlePropertyWarehouse() {
  const state = getState();

  if (!state.wolfQuest2Done) {
    setStory(
      "你走到物业仓库门前，发现铁门上挂着一把生锈的大锁。\n" +
      "透过门缝往里看，隐约能看到一个蜷缩的身影……\n\n" +
      "就在这时，老狼不知从哪冒了出来，挡在你面前：\n" +
      "\"那个地方……你还是别去了。\" 他的眼神很复杂。\n" +
      "\"等你帮我办妥了那些事，我自然会告诉你里面有什么。\"\n\n" +
      "老狼不希望你去那个地方，还是算了。"
    );
    showExploreOptionsState();
    return;
  }

  handleMermaidInteract();
}

/* ============================================================
   受伤人鱼 —— 亲和度系统
   ============================================================ */

export function handleMermaidInteract() {
  const state = getState();
  const mermaidAff = getNpcAffinity("mermaid");

  setPhase("explore");

  let storyText;
  const affInfo = `\n\n当前好感度：${mermaidAff}/${GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY}`;
  if (mermaidAff < 30) {
    storyText =
      "你推开物业仓库锈迹斑斑的铁门，一股潮湿的海腥味扑面而来。\n" +
      "仓库深处，一个破旧的浴缸里蜷缩着一个奇异的生物——\n" +
      "上半身是苍白的少女形态，下半身却是一条覆盖着黯淡鳞片的鱼尾。\n\n" +
      "她的鱼尾上有一道深深的伤口，鳞片脱落了大半，露出下面发炎的皮肉。\n" +
      "她抬起头，虚弱而警惕地看着你，嘴唇微微颤动却没有发出声音。" +
      affInfo;
  } else if (mermaidAff < 80) {
    storyText =
      "受伤的人鱼看到你，眼中闪过一丝微弱的光芒。\n" +
      "她的鱼尾伤口似乎好了一些，但依旧触目惊心。\n" +
      "她用沙哑的声音轻轻说道：\"你……又来了。谢谢你……那些鳞片……\"" +
      affInfo;
  } else if (mermaidAff < GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
    storyText =
      `人鱼的精神好多了。她的鱼尾上的伤口已经开始愈合，\n` +
      `一些新的、微小的鳞片正在重新生长。\n` +
      `"我感觉到……力量在慢慢回来。" 她的声音不再沙哑，\n` +
      `而是带着一种奇异的、像海浪般的韵律。\n` +
      `"再帮帮我……再给我一些鳞片……我就快能回家了……"` +
      affInfo;
  } else {
    storyText =
      `人鱼的鱼尾已经完全愈合！新的鳞片闪烁着珍珠般的光泽，\n` +
      `在昏暗的仓库中像星辰一样明亮。\n\n` +
      `她从浴缸中站起身——不，是飘了起来——水珠悬浮在她周围，\n` +
      `空气中弥漫着海洋的清新气息。\n\n` +
      `"谢谢你……陌生人。不，你已经不是陌生人了。"\n` +
      `她伸出手，一柄造型奇特的渔叉从水雾中缓缓浮现——\n` +
      `"这是海歌渔叉，我们一族的圣物。它曾经属于我的母亲，\n` +
      `现在……它属于你。"\n\n` +
      `她将渔叉递到你手中，眼中闪烁着泪光：\n` +
      `"请帮帮老狼……帮我们消灭那个深海的怪物。\n` +
      `只有它死了，我才能真正自由地回到大海。"\n\n` +
      `🎁 获得：【海歌渔叉】！\n` +
      `🔓 老狼任务三"出海前的准备"已解锁！` +
      affInfo;
  }

  setStory(storyText);

  const lightningItem = state.other.find(i => i.id === "lightning_scale");
  const thunderItem = state.other.find(i => i.id === "thunder_scale");
  const lightningCount = lightningItem ? (lightningItem.count || 1) : 0;
  const thunderCount = thunderItem ? (thunderItem.count || 1) : 0;

  const opts = [];
  opts.push({
    text: `提交闪电鳞片（+${GAME_CONSTANTS.WOLF.MERMAID_LIGHTNING_AFFINITY}好感 拥有：${lightningCount}）`,
    action: "mermaid_submit_lightning",
    disabled: lightningCount === 0 || mermaidAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY,
  });
  opts.push({
    text: `提交通雷鳞片（+${GAME_CONSTANTS.WOLF.MERMAID_THUNDER_AFFINITY}好感 拥有：${thunderCount}）`,
    action: "mermaid_submit_thunder",
    disabled: thunderCount === 0 || mermaidAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY,
  });
  opts.push({ text: "离开", action: "mermaid_leave" });

  setOptions(opts);
}

export function handleMermaidSubmitLightning() {
  handleMermaidSubmitScale("lightning_scale", GAME_CONSTANTS.WOLF.MERMAID_LIGHTNING_AFFINITY);
}

export function handleMermaidSubmitThunder() {
  handleMermaidSubmitScale("thunder_scale", GAME_CONSTANTS.WOLF.MERMAID_THUNDER_AFFINITY);
}

function handleMermaidSubmitScale(scaleId, affinityGain) {
  const state = getState();

  const idx = state.other.findIndex(i => i.id === scaleId);
  if (idx === -1) {
    setStory("你没有这个鳞片，人鱼失望地垂下了眼帘。");
    handleMermaidInteract();
    return;
  }

  const scaleItem = state.other[idx];
  if ((scaleItem.count || 1) > 1) {
    scaleItem.count--;
  } else {
    state.other.splice(idx, 1);
  }

  const newAff = addNpcAffinity("mermaid", affinityGain);

  const scaleName = scaleId === "lightning_scale" ? "闪电鳞片" : "通雷鳞片";

  let storyMsg = `你将一片${scaleName}递给人鱼。\n\n`;

  if (scaleId === "lightning_scale") {
    storyMsg +=
      `她接过鳞片，轻轻放在自己的伤口上。鳞片融化了——\n` +
      `化作一道微弱的电弧，渗入了她的鱼尾。\n` +
      `伤口的边缘似乎缩小了一点点……`;
  } else {
    storyMsg +=
      `她双手捧住通雷鳞片，闭上眼睛，低声吟唱了一段古老的曲调。\n` +
      `鳞片在低沉的雷声中化作金色的光点，覆盖了她的全身。\n` +
      `伤口以肉眼可见的速度愈合了一小片！`;
  }

  storyMsg += `\n\n人鱼好感度：${newAff}/${GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY}`;

  // 检查是否达到最大好感度
  if (newAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
    const harpoon = MELEE_WEAPONS.find(w => w.id === GAME_CONSTANTS.WOLF.MERMAID_REWARD_WEAPON);
    if (harpoon) {
      const weapon = { ...harpoon, currentDurability: harpoon.durability };
      const added = addItem(weapon);
      if (added) {
        storyMsg +=
          `\n\n就在鳞片完全融入的瞬间，人鱼的身体突然绽放出耀眼的光芒。\n` +
          `水雾在她周围旋转、升腾，最终凝聚成一柄造型古朴而优雅的渔叉——\n` +
          `"海歌渔叉"——它的叉尖闪烁着珍珠般的光泽，叉柄上刻着古老的海洋符文。\n\n` +
          `人鱼双手将渔叉捧起，郑重地交给你：\n` +
          `"这是我们族中最珍贵的武器，我的母亲说，只有真正的朋友才配拥有它。\n` +
          `现在，你就是我们真正的朋友了。"\n\n` +
          `她的眼中映着鳞光：\n` +
          `"去告诉老狼……关于那个深海怪物的事。它不该存在于这个世界。\n` +
          `你们需要联手——我会在海中为你们引路。"`;
      } else {
        storyMsg += `\n\n⚠ 背包已满，无法获得海歌渔叉！请清理背包后再来。`;
        // 好感度保持，但回滚一点让玩家可以重新触发
        state.npcAffinity.mermaid = GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY - 1;
        setStory(storyMsg);
        handleMermaidInteract();
        return;
      }
    }
    storyMsg += `\n\n🎁 获得：【海歌渔叉】！\n🔓 老狼任务三"出海前的准备"已解锁！`;
  }

  setStory(storyMsg);

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    if (newAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
      handleMermaidInteract();
    } else {
      handleMermaidInteract();
    }
  }
}

export function handleMermaidLeave() {
  setStory("你轻轻关上了物业仓库的门，人鱼的目光在黑暗中渐渐隐去。");
  showExploreOptionsState();
}

/* ============================================================
   巨型海尸战斗后处理 —— 在 combat.js 中通过 _wolfQuest4Combat 标记触发
   ============================================================ */

export function checkWolfQuest4Victory() {
  const state = getState();
  if (!state._wolfQuest4Combat) return false;

  delete state._wolfQuest4Combat;

  if (state._combatNpcDefeated) {
    state.wolfQuest4Done = true;
    state.stats.bossesDefeated.push(GAME_CONSTANTS.WOLF.BOSS_SEA_MONSTER);
    triggerEnding("ending_mermaid");
    return true;
  }

  // 战斗失败由 combat.js 的 checkDeath 处理
  return false;
}
