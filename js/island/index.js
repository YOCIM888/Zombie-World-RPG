import {
  getState, setPhase, setStory, setOptions,
  addItem, addRoyalCoins, removeRoyalCoins,
  addGasoline, removeGasoline,
  advanceTime, updateStatusEffects, checkDeath,
  setLocation, isQuestDone,
} from '../state.js';

import {
  GAME_CONSTANTS, MAPS,
  pickRandomLoot, SPECIAL_ITEMS, NAMED_NPCS,
} from '../config.js';

import {
  hasCastleIdentity,
  cleanDualIdentity,
  getCastleRank,
  getCastleRankName,
} from '../faction.js';

import { showExploreOptionsState } from '../routing.js';

import {
  handleFishingArea,
} from './fishing.js';

import {
  handleNpcYumo, handleYumoAction,
} from './yumo.js';

import {
  handleNpcGuyue, handleGuyueAction,
} from './guyue.js';

import {
  handleNpcLinhan, handleLinhanAction,
} from './linhan.js';

import { handleBar, handleBarAction } from './bar.js';
import { handleStreet, handleStreetAction } from './street.js';
import { handleInvest, handleInvestAction } from './invest.js';
import { handleBlackMarket, handleBlackMarketAction } from './black-market.js';
import { handleIntel, handleIntelAction } from './intel.js';
import { checkRobberEncounter, handleRobberEncounter } from '../map-events/robber.js';

function calculateIslandInterest(debt, overdueDays) {
  const IC = GAME_CONSTANTS.ISLAND;
  const steps = Math.floor(overdueDays / IC.INTEREST_OVERDUE_STEP);
  const rate = Math.min(IC.INTEREST_RATE_BASE + steps * IC.INTEREST_RATE_PER_STEP, IC.INTEREST_RATE_CAP);
  return Math.round(debt * rate);
}

export function handleEnterIsland() {
  const state = getState();
  const islandMap = MAPS.find(m => m.id === "小型岛屿");
  state.currentMap = islandMap;
  setLocation("小型岛屿");

  if (state.islandDebt) {
    const daysLeft = state.islandDebt.dueDay - state.day;
    if (daysLeft < 0) {
      setStory(`你踏上了小型岛屿。余墨公爵的管家匆匆赶来：\"阁下的岛屿银行债务已逾期 ${-daysLeft} 天，请尽快前往银行还款！\"`);
      refreshIslandMenu();
      return;
    }
  }

  setStory("你驾驶游艇来到了小型岛屿。这座岛屿风景秀丽，是国王赐予余墨公爵的封地。岛上的居民安居乐业，城堡的旗帜在岛中央飘扬。");
  refreshIslandMenu();
}

export function refreshIslandMenu() {
  const state = getState();
  setPhase("island");
  const options = [
    { text: "探索", action: "island_explore" },
    { text: "进食", action: "eat" },
    { text: "饮水", action: "drink" },
    { text: "医疗", action: "medicine" },
    { text: "装备", action: "equip" },
    { text: "离开", action: "island_leave" },
    { text: "丢弃", action: "discard" },
    { text: "岛民顾月", action: "island_guyue" },
    { text: "岛民林寒", action: "island_linhan" },
    { text: "余墨公爵", action: "island_yumo" },
  ];
  if (isQuestDone("yumoQuest2") && !isQuestDone("yumoQuest3")) {
    options.push({ text: "清理登陆丧尸", action: "island_clean_diving" });
  }
  options.push({ text: "钓鱼区域", action: "island_fishing" });
  options.push({ text: "岛内休息", action: "island_rest" });
  options.push({ text: "凯伦国王酒吧", action: "island_bar" });
  options.push({ text: "艾莉娜皇后街", action: "island_street" });
  options.push({ text: "卢修斯投资行", action: "island_invest" });
  options.push({ text: "皇家黑市", action: "island_black_market" });
  options.push({ text: "情报中枢", action: "island_intel" });
  options.push({ text: "岛屿银行", action: "island_bank" });
  options.push({ text: "补助福利", action: "island_welfare" });
  options.push({ text: "王国储油船", action: "island_oil_tanker" });
  setOptions(options);
}

export function handleIslandAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;

  const action = state.options[optIdx].action;

  switch (action) {
    case "island_explore":
      handleIslandExplore();
      break;
    case "eat":
    case "drink":
    case "medicine":
    case "equip":
    case "discard":
      return action;
    case "island_leave":
      handleIslandLeave();
      break;
    case "island_guyue":
      handleNpcGuyue();
      break;
    case "island_linhan":
      handleNpcLinhan();
      break;
    case "island_yumo":
      handleNpcYumo();
      break;
    case "island_clean_diving":
      handleCleanDivingZombie();
      break;
    case "island_fishing":
      handleFishingArea();
      break;
    case "island_rest":
      handleIslandRest();
      break;
    case "island_bar":
      handleBar();
      break;
    case "island_street":
      handleStreet();
      break;
    case "island_invest":
      handleInvest();
      break;
    case "island_bank":
      handleIslandBank();
      break;
    case "island_black_market":
      handleBlackMarket();
      break;
    case "island_intel":
      handleIntel();
      break;
    case "island_welfare":
      handleIslandWelfare();
      break;
    case "island_oil_tanker":
      handleIslandOilTanker();
      break;
    case "oil_tanker_buy":
      handleOilTankerBuy();
      break;
    case "oil_tanker_sell":
      handleOilTankerSell();
      break;
    case "oil_tanker_back":
      refreshIslandMenu();
      break;
  }
}

export function handleIslandExplore() {
  const state = getState();
  const map = state.currentMap;
  if (!map) {
    refreshIslandMenu();
    return;
  }

  const currentTurn = state.day * 8 + state.phaseIndex;
  const intelActive = state.intelImmunityEnd && state.intelImmunityEnd > currentTurn;

  if (!intelActive) {
    if (checkRobberEncounter(state)) {
      handleRobberEncounter();
      if (!state.gameOver) refreshIslandMenu();
      return;
    }
  }

  const loot = pickRandomLoot(map);
  if (!loot) {
    setStory("你在岛上四处寻找，什么也没找到。");
  } else {
    const added = addItem(loot);
    if (!added) {
      setStory(`你发现了${loot.name}，但背包已满，无法携带。`);
    } else {
      setStory(`你在岛上发现了${loot.name}！`);
    }
  }

  advanceTime(1);
  const wasFoggy = state.weather === "大雾";
  if (wasFoggy) advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshIslandMenu();
}

export function handleIslandLeave() {
  const state = getState();
  const portMap = MAPS.find(m => m.id === "江边港口码头");
  state.currentMap = portMap;
  setLocation("江边港口码头");
  setStory("你驾驶游艇返回了江边港口码头。");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

export function handleIslandRest() {
  const state = getState();
  const healAmount = Math.min(GAME_CONSTANTS.ISLAND.REST_HEALTH, GAME_CONSTANTS.MAX_HEALTH - state.health);
  const crashReduction = Math.min(GAME_CONSTANTS.ISLAND.REST_FATIGUE, state.crash);
  state.health = Math.min(state.health + GAME_CONSTANTS.ISLAND.REST_HEALTH, GAME_CONSTANTS.MAX_HEALTH);
  state.crash = Math.max(state.crash - GAME_CONSTANTS.ISLAND.REST_FATIGUE, 0);
  state.sanity = Math.min(GAME_CONSTANTS.SANITY_MAX, state.sanity + GAME_CONSTANTS.ISLAND.REST_SANITY_RECOVERY);

  setStory(`你在岛上的小屋中休憩了一段时间，海风轻拂，你感到身心都得到了充分的放松。\n恢复了${healAmount}点生命，降低了${crashReduction}点疲惫，理智恢复了${GAME_CONSTANTS.ISLAND.REST_SANITY_RECOVERY}点。`);

  advanceTime(GAME_CONSTANTS.ISLAND.REST_TIME);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshIslandMenu();
}

export function handleCleanDivingZombie() {
  const state = getState();
  const dz = NAMED_NPCS.diving_zombie;
  state._pendingNpc = {
    name: dz.name,
    hp: dz.hp,
    damage: Math.floor(Math.random() * (dz.damageMax - dz.damageMin + 1)) + dz.damageMin,
    hasRanged: dz.hasRanged,
    dodgeRate: dz.dodgeRate,
  };
  state._divingZombieCombat = true;
  setPhase("pre_combat_npc");
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ 你的身体极度疲惫，无法正常战斗！建议先休息再探索。" : "";
  setStory(`一只潜水丧尸从海中爬上了岸，浑身滴着腥臭的海水，朝你扑来！${crashWarning}`);
  setOptions([
    { text: "近战作战", action: "combat_npc_melee" },
    { text: "远程射击", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}

export function handleIslandBank() {
  setPhase("island_bank");
  const state = getState();

  if (state.islandDebt) {
    const daysLeft = state.islandDebt.dueDay - state.day;
    if (daysLeft < 0) {
      const overdueDays = -daysLeft;
      const interest = calculateIslandInterest(state.islandDebt.amount, overdueDays);
      const IC = GAME_CONSTANTS.ISLAND;
      const steps = Math.floor(overdueDays / IC.INTEREST_OVERDUE_STEP);
      const rate = Math.min(IC.INTEREST_RATE_BASE + steps * IC.INTEREST_RATE_PER_STEP, IC.INTEREST_RATE_CAP);
      state.islandDebt.amount += interest;
      state.islandDebt.dueDay = state.day + GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS;
      setStory(`🏦 债务逾期处理\n\n阁下的岛屿银行债务已逾期 ${overdueDays} 天，加上${Math.round(rate * 100)}%利息（${interest}皇家币），现在共欠${state.islandDebt.amount}皇家币，还款期限已延至第${state.islandDebt.dueDay}天。`);
      setOptions([{ text: "继续", action: "island_bank_continue" }]);
      return;
    }
  }

  let info = "🏦 【岛屿银行】\n由皇后开设的皇家银行\n\n";
  if (state.islandDebt) {
    const daysLeft = state.islandDebt.dueDay - state.day;
    info += `当前债务：${state.islandDebt.amount}皇家币（还剩 ${daysLeft} 天还款）\n\n`;
  } else {
    info += "你目前没有债务。\n\n";
  }
  info += "借贷：借支皇家币（10/20/30/40/50/60/70/80/90/100十档）\n还款：偿还债务";
  setStory(info);
  setOptions([
    { text: "借贷", action: "island_loan" },
    { text: state.islandDebt ? "还款" : "还款（无债务）", action: "island_repay", disabled: !state.islandDebt },
    { text: "离开", action: "island_bank_leave" },
  ]);
}

export function handleIslandBankAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  if (action === "island_loan") {
    handleIslandLoan();
    return;
  }
  if (action === "island_repay") {
    handleIslandRepay();
    return;
  }
  if (action === "island_loan_submit") {
    handleIslandLoanSubmit(input);
    return;
  }
  if (action === "island_bank_continue") {
    handleIslandBank();
    return;
  }
  if (action === "island_bank_leave" || action === "island_loan_back") {
    handleIslandBankLeave();
    return;
  }
}

export function handleIslandBankLeave() {
  refreshIslandMenu();
}

function hasAnyCastleRelatedIdentity(state) {
  if (hasCastleIdentity(state)) return true;
  if (state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id)) return true;
  return false;
}

export function handleIslandLoan() {
  const state = getState();
  if (state.islandDebt) {
    setStory("你还有未还清的债务，先还清再来借吧。");
    handleIslandBank();
    return;
  }
  if (!hasAnyCastleRelatedIdentity(state)) {
    setStory("银行柜员礼貌地说：\"只有城堡相关势力成员才能使用岛屿银行。请出示城堡通行证或城堡身份牌。\"");
    handleIslandBank();
    return;
  }
  cleanDualIdentity(state);
  setPhase("island_bank");
  const opts = [];
  for (const amount of GAME_CONSTANTS.ISLAND.LOAN_AMOUNTS) {
    opts.push({ text: `${amount}皇家币`, action: "island_loan_submit", amount });
  }
  opts.push({ text: "返回", action: "island_loan_back" });
  setStory(`🏦 请选择借贷金额（皇后开设的银行，利息仅${GAME_CONSTANTS.ISLAND.INTEREST_RATE_BASE * 100}%，期限${GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS}天）：`);
  setOptions(opts);
}

export function handleIslandLoanSubmit(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "island_loan_submit") return;
  const amount = option.amount;
  state.islandDebt = { amount, dueDay: state.day + GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS };
  addRoyalCoins(amount);
  setStory(`✅ 你从岛屿银行借贷了 ${amount} 皇家币。柜员微笑着说：\"皇后殿下吩咐过，利息只需10%，请务必在 ${GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS} 天内还清。\"\n\n当前皇家币：${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_bank");
    setOptions([{ text: "继续", action: "island_bank_continue" }]);
  }
}

export function handleIslandBarAction(input) {
  handleBarAction(input);
}

export function handleIslandStreetAction(input) {
  handleStreetAction(input);
}

export function handleIslandBlackMarketAction(input) {
  handleBlackMarketAction(input);
}

export function handleIslandIntelAction(input) {
  handleIntelAction(input);
}

export function handleIslandInvestAction(input) {
  handleInvestAction(input);
}

export function handleIslandRepay() {
  const state = getState();
  if (!state.islandDebt) {
    setStory("你没有债务需要偿还。");
    handleIslandBank();
    return;
  }
  const needed = state.islandDebt.amount;
  if (state.royalCoins < needed) {
    setStory(`❌ 你需要 ${needed} 皇家币来还清债务，但你只有 ${state.royalCoins} 皇家币。去城堡皇后那里兑换一些皇家币再来吧。`);
    handleIslandBank();
    return;
  }
  removeRoyalCoins(needed);
  state.islandDebt = null;
  state.islandDebtTriggered = false;
  setStory(`✅ 你偿还了全部债务（${needed}皇家币）。柜员点点头：\"谢谢您的诚信，皇后殿下会很高兴的。\"\n\n当前皇家币：${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_bank");
    setOptions([{ text: "继续", action: "island_bank_continue" }]);
  }
}

export function handleIslandWelfare() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank === 0) {
    setStory("❌ 福利窗口的工作人员瞟了你一眼：\"只有城堡贵族才能领取补助福利，你还没有获得贵族身份。\"");
    refreshIslandMenu();
    return;
  }
  const IC = GAME_CONSTANTS.ISLAND;
  const daysSinceLast = state.day - state.lastIslandWelfareDay;
  if (state.lastIslandWelfareDay > 0 && daysSinceLast < IC.WELFARE_COOLDOWN_DAYS) {
    const daysLeft = IC.WELFARE_COOLDOWN_DAYS - daysSinceLast;
    setStory(`⏳ 你还没到下次领取福利的时间。\n\n距离下次可领取还有 ${daysLeft} 天。`);
    refreshIslandMenu();
    return;
  }
  const reward = IC.WELFARE_REWARDS[rank] || rank;
  state.lastIslandWelfareDay = state.day;
  addRoyalCoins(reward);
  const rankName = getCastleRankName(state);
  setStory(`✅ 【补助福利】\n\n工作人员核对了你的身份牌：\"${rankName}阁下，这是您的贵族补助。\"\n你领取了 ${reward} 皇家币。\n\n当前皇家币：${state.royalCoins}\n下次可领取：第${state.day + IC.WELFARE_COOLDOWN_DAYS}天`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshIslandMenu();
}

export function handleIslandOilTanker() {
  const state = getState();
  const IC = GAME_CONSTANTS.ISLAND;
  setPhase("island");
  setStory(`⛽ 【王国储油船】\n\n一艘巨大的皇家油轮停靠在岛屿码头，上面印着皇家徽记。\n船长热情地迎上来：\"欢迎！这是王国官方的汽油交易站。\"\n\n💰 购买汽油：${IC.OIL_TANKER_BUY_PRICE}皇家币 → 1汽油\n♻️ 回收汽油：1汽油 → ${IC.OIL_TANKER_SELL_PRICE}皇家币\n\n当前持有：${state.royalCoins}皇家币 | ${state.gasoline}汽油`);
  setOptions([
    { text: `购买汽油（${IC.OIL_TANKER_BUY_PRICE}币→1汽油）`, action: "oil_tanker_buy" },
    { text: `回收汽油（1汽油→${IC.OIL_TANKER_SELL_PRICE}币）`, action: "oil_tanker_sell" },
    { text: "离开", action: "oil_tanker_back" },
  ]);
}

export function handleOilTankerBuy() {
  const state = getState();
  const IC = GAME_CONSTANTS.ISLAND;
  if (state.royalCoins < IC.OIL_TANKER_BUY_PRICE) {
    setStory(`❌ 你的皇家币不足。需要${IC.OIL_TANKER_BUY_PRICE}皇家币，当前只有${state.royalCoins}皇家币。`);
    handleIslandOilTanker();
    return;
  }
  removeRoyalCoins(IC.OIL_TANKER_BUY_PRICE);
  addGasoline(1);
  setStory(`✅ 你花费${IC.OIL_TANKER_BUY_PRICE}皇家币购买了1汽油。\n\n当前皇家币：${state.royalCoins} | 当前汽油：${state.gasoline}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleIslandOilTanker();
}

export function handleOilTankerSell() {
  const state = getState();
  const IC = GAME_CONSTANTS.ISLAND;
  if (state.gasoline < 1) {
    setStory("❌ 你没有汽油可以回收。");
    handleIslandOilTanker();
    return;
  }
  removeGasoline(1);
  addRoyalCoins(IC.OIL_TANKER_SELL_PRICE);
  setStory(`✅ 你回收了1汽油，获得${IC.OIL_TANKER_SELL_PRICE}皇家币。\n\n当前皇家币：${state.royalCoins} | 当前汽油：${state.gasoline}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleIslandOilTanker();
}
