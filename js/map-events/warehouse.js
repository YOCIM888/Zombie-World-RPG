import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addCigarettes,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getBackpackCount,
} from '../state.js';

import {
  WAREHOUSE_GUARD_DIALOGUES,
  BUILDING_MATERIALS,
  GAME_CONSTANTS,
  RANGED_WEAPONS,
  MAP_NPC_INTROS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { hasCastleIdentity } from '../faction.js';

const OLDMAN_QUESTS = [
  { id: 1, name: "寻找档案", desc: "收集10份犯罪资料交给老马", type: "collect", require: 10, reward: 3, intro: "老马眯起眼睛，凑近你低声说道：\"你碰过那东西了吧？嘿嘿，我就知道。末日违禁品，不是谁都有胆子碰的。既然你上了这条船……帮我办几件事。\"他转身从一堆杂物中翻出一个泛黄的牛皮纸箱。\"废弃警察局的档案柜里，有一批尘封的犯罪资料。帮我收集10份来。那是我的'老本行'留下的东西。\"" },
  { id: 2, name: "除掉黑影", desc: "消灭仓储超市的黑影", type: "kill_shadow", reward: 5, intro: "老马翻看着你送来的资料，嘴角露出一丝诡异的笑容：\"好，很好……黑影。那个在超市深处活动的家伙，他就是当年运输违禁品案的主谋之一。整个链条，从他开始。去把他解决掉。\"" },
  { id: 3, name: "除掉马三", desc: "击败食人魔马三", type: "kill_masan", reward: 10, intro: "老马听到黑影被灭的消息，满意地点了点头：\"一条线，断了。但还有另一条——国道服务区那个厨子，马三。你应该听说过他的'菜'吧？食人魔。他也是当年链上的一环，负责'处理'不听话的人。去，把他从这世上抹掉。\"" },
  { id: 4, name: "除掉国王", desc: "刺杀城堡国王", type: "kill_king", reward: 15, intro: "老马抽了口烟，吐出一个烟圈：\"马三死了？干净利落。下一个目标，稍微有点分量——城堡里的那位国王陛下。他利用权势包庇了多少黑势力，你知道吗？他那顶王冠上，沾的可不只是金粉。\"他顿了顿，眼神变得锐利：\"不过，如果你身上有城堡的身份，我不建议你接这个活。自己掂量。\"" },
  { id: 5, name: "除掉老赵", desc: "除掉检查站的老赵", type: "kill_zhao", reward: 20, intro: "老马沉默了很久，才开口：\"国王……也死了。你真是越来越利索了。下一个——军事检查站那个老兵，老赵。他害死了太多想通过检查站的平民。打着'安全审查'的幌子，干着杀人的勾当。去，让他偿命。\"" },
  { id: 6, name: "除掉陈博士", desc: "除掉生化研究所的陈博士", type: "kill_doctor", reward: 25, intro: "老马把烟头狠狠按灭：\"老赵完了？好。还剩最后一个——生化研究所的陈博士。你知道这末世为什么三年了还没结束？就是因为他们这种'科学家'！天天在那研究病毒，研究来研究去，丧尸越来越多！去，把他给我解决了！\"" },
  { id: 7, name: "地下地铁隧道", desc: "前往地下地铁隧道-等待老马", type: "final", reward: 30, intro: "老马笑呵呵地拍着你的肩膀，笑容里有一丝说不清道不明的意味：\"全办妥了。黑影、马三、国王、老赵、陈博士……一个不落。你真是我见过最趁手的一把'好刀'。来吧，最后一桩——去地下地铁隧道等我。我亲自给你送30根烟，当面谢你。\"" },
];

export function handleWarehouseGuardInteract() {
  const state = getState();
  if (state.oldMaContrabandUsed) {
    handleOldMaQuestInteract();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.warehouse_guard_intro);
  setOptions([
    { text: "对话", action: "warehouse_guard_chat" },
    { text: "交易", action: "warehouse_guard_trade" },
    { text: "离开", action: "warehouse_guard_leave" },
  ]);
}

export function handleWarehouseGuardChat() {
  setPhase("explore");
  const line = WAREHOUSE_GUARD_DIALOGUES[Math.floor(Math.random() * WAREHOUSE_GUARD_DIALOGUES.length)];
  setStory(line);
  setOptions([
    { text: "对话", action: "warehouse_guard_chat" },
    { text: "交易", action: "warehouse_guard_trade" },
    { text: "离开", action: "warehouse_guard_leave" },
  ]);
}

export function handleWarehouseGuardLeave() {
  setStory("你离开了仓库守卫，回到街道上。");
  showExploreOptionsState();
}

export function handleWarehouseGuardTrade() {
  const state = getState();
  if (state.lastWarehouseTradeDay >= state.day) {
    setStory("今天已经和老马交易过了，明天再来吧。");
    handleWarehouseGuardInteract();
    return;
  }
  const buildingIds = BUILDING_MATERIALS.map(b => b.id);
  const buildingCount = state.other.filter(i => buildingIds.includes(i.id)).reduce((sum, i) => sum + (i.count || 1), 0);
  if (buildingCount < GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST) {
    setStory(`老马摇了摇头：\"建筑材料不够啊，至少需要${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}件建材，你只有${buildingCount}件。去多搜刮点再来吧！\"`);
    handleWarehouseGuardInteract();
    return;
  }
  setStory(`老马看了看你的建材：\"不错不错，${buildingCount}件建材。${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}件换一把远程武器，干不干？\"`);
  setPhase("explore");
  setOptions([
    { text: `交易${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}件建材`, action: "warehouse_guard_trade_confirm" },
    { text: "再想想", action: "warehouse_guard_chat" },
  ]);
}

export function handleWarehouseGuardTradeConfirm() {
  const state = getState();
  const buildingIds = BUILDING_MATERIALS.map(b => b.id);
  const buildingCount = state.other.filter(i => buildingIds.includes(i.id)).reduce((sum, i) => sum + (i.count || 1), 0);
  if (buildingCount < GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST) {
    setStory("建材不够了。");
    handleWarehouseGuardInteract();
    return;
  }
  if (getBackpackCount() - GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST + 1 > state.backpack.capacity) {
    setStory("背包空间不足，无法完成交易。");
    handleWarehouseGuardInteract();
    return;
  }
  let remaining = GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST;
  for (let i = state.other.length - 1; i >= 0 && remaining > 0; i--) {
    if (buildingIds.includes(state.other[i].id)) {
      const available = state.other[i].count || 1;
      if (available <= remaining) {
        state.other.splice(i, 1);
        remaining -= available;
      } else {
        state.other[i].count = available - remaining;
        remaining = 0;
      }
    }
  }
  const laomaWeapons = RANGED_WEAPONS.filter(w => w.rarity === "common");
  const weapon = laomaWeapons[Math.floor(Math.random() * laomaWeapons.length)];
  const added = addItem({ ...weapon });
  if (added) {
    setStory(`老马接过${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}件建筑材料，仔细检查了一番，满意地点了点头。他从仓库深处拿出一把${weapon.name}递给你。\"物有所值！\"`);
  } else {
    setStory(`老马接过${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}件建筑材料，递给你一把${weapon.name}，但你的背包已满，无法携带。`);
  }
  state.lastWarehouseTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

// ========== 老马任务链 ==========

export function handleOldMaQuestInteract() {
  const state = getState();
  setPhase("explore");

  if (state.oldMaStep === 0) {
    // 初次触发
    state.oldMaStep = 1;
    const q = OLDMAN_QUESTS[0];
    setStory(q.intro + `\n\n📋 当前任务：${q.name}\n📝 ${q.desc}\n💰 奖励：${q.reward}根香烟`);
  } else if (state.oldMaStep >= 1 && state.oldMaStep <= 6) {
    const q = OLDMAN_QUESTS[state.oldMaStep - 1];
    const canSubmit = checkOldMaQuestCondition(state, q);
    let story = `老马蹲在仓库角落，看到你来了，咧嘴一笑。`;
    story += `\n\n📋 当前任务：${q.name}\n📝 ${q.desc}\n💰 奖励：${q.reward}根香烟`;
    if (q.type === "collect") {
      story += `\n📁 进度：${state.crimeDataCount}/${q.require}`;
    }
    if (canSubmit) {
      story += `\n\n✅ 任务条件已满足！";`;
    }
    setStory(story);
  } else if (state.oldMaStep === 7) {
    setStory("老马笑呵呵地看着你：\"还等什么呢？去地下地铁隧道吧，我在那儿等你。\"");
  }

  buildOldMaOptions();
}

function checkOldMaQuestCondition(state, quest) {
  switch (quest.type) {
    case "collect":
      return state.crimeDataCount >= quest.require;
    case "kill_shadow":
      return state.shadowDefeated === true;
    case "kill_masan":
      return state.outlawKilled === true;
    case "kill_king": {
      const hasId = hasCastleIdentity(state);
      return state.kingKilled === true && !hasId;
    }
    case "kill_zhao":
      return state.zhaoKilled === true;
    case "kill_doctor":
      return state.doctorKilled === true;
    case "final":
      return false;
    default:
      return false;
  }
}

function buildOldMaOptions() {
  const state = getState();
  const opts = [];

  if (state.oldMaStep >= 1 && state.oldMaStep <= 6) {
    const q = OLDMAN_QUESTS[state.oldMaStep - 1];
    const canSubmit = checkOldMaQuestCondition(state, q);

    // 任务4特殊检查：如果有城堡身份不能提交
    if (q.type === "kill_king") {
      const hasId = hasCastleIdentity(state);
      if (hasId && !state.kingKilled) {
        opts.push({ text: "提交任务（你身上有城堡身份，无法接这个任务）", action: "oldma_submit", disabled: true });
      } else if (canSubmit) {
        opts.push({ text: `提交任务（领取${q.reward}根香烟）`, action: "oldma_submit" });
      } else {
        opts.push({ text: "提交任务（条件未满足）", action: "oldma_submit", disabled: true });
      }
    } else if (canSubmit) {
      opts.push({ text: `提交任务（领取${q.reward}根香烟）`, action: "oldma_submit" });
    } else {
      opts.push({ text: "提交任务（条件未满足）", action: "oldma_submit", disabled: true });
    }
  }

  opts.push({ text: "对话", action: "oldma_chat" });
  opts.push({ text: "交易", action: "warehouse_guard_trade" });
  opts.push({ text: "离开", action: "warehouse_guard_leave" });
  setOptions(opts);
}

export function handleOldMaQuestSubmit() {
  const state = getState();
  if (state.oldMaStep < 1 || state.oldMaStep > 6) {
    handleOldMaQuestInteract();
    return;
  }

  const q = OLDMAN_QUESTS[state.oldMaStep - 1];
  const canSubmit = checkOldMaQuestCondition(state, q);

  if (!canSubmit) {
    setStory("老马摇了摇头：\"条件还没满足，别着急。等你办妥了再来找我。\"");
    handleOldMaQuestInteract();
    return;
  }

  // 任务4特殊检查
  if (q.type === "kill_king") {
    const hasId = hasCastleIdentity(state);
    if (hasId && !state.kingKilled) {
      setStory("老马冷冷地看着你：\"你身上还带着城堡的身份？我看你是没想清楚。等你和城堡彻底断了关系，再来找我。\"");
      handleOldMaQuestInteract();
      return;
    }
  }

  // 消耗物品（任务1：犯罪资料）
  if (q.type === "collect") {
    let remaining = q.require;
    for (let i = state.other.length - 1; i >= 0 && remaining > 0; i--) {
      if (state.other[i].id === "crime_data") {
        const available = state.other[i].count || 1;
        if (available <= remaining) {
          state.other.splice(i, 1);
          remaining -= available;
          state.crimeDataCount -= available;
        } else {
          state.other[i].count = available - remaining;
          state.crimeDataCount -= remaining;
          remaining = 0;
        }
      }
    }
  }

  // 发放奖励
  addCigarettes(q.reward);
  state.oldMaStep++;

  if (state.oldMaStep <= 6) {
    // 下一个任务
    const nextQ = OLDMAN_QUESTS[state.oldMaStep - 1];
    setStory(`老马接过东西，脸上露出满意的神色：\"干得漂亮！这是你的${q.reward}根香烟。\"\n\n他收了收笑容，凑近你说道：${nextQ.intro}\n\n📋 新任务：${nextQ.name}\n📝 ${nextQ.desc}\n💰 奖励：${nextQ.reward}根香烟`);
  } else if (state.oldMaStep === 7) {
    const finalQ = OLDMAN_QUESTS[6];
    setStory(`老马接过东西，哈哈大笑：\"${q.reward}根烟，拿着！\"\n\n${finalQ.intro}\n\n📋 最终任务：${finalQ.name}\n📝 ${finalQ.desc}`);
  }

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleOldMaQuestInteract();
  }
}

export function handleOldMaChat() {
  const state = getState();
  setPhase("explore");
  const dialogues = [
    "老马吐出一口烟：\"这末世啊，每个人都有自己的账本。我只是帮他们……结账。\"",
    "老马若有所思地看着远方：\"你知道吗，末世之前我是个会计。现在？现在我在算更大的账。\"",
    "老马弹了弹烟灰：\"别问太多。有些事，知道得越少越好。\"",
    "老马打了个哈欠：\"办你的事就对了，少打听。\"",
    "老马从怀里掏出一张泛黄的老照片，看了看又收了起来。他没说什么。",
  ];
  const line = dialogues[Math.floor(Math.random() * dialogues.length)];
  setStory(line);
  buildOldMaOptions();
}
