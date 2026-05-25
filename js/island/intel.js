import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { GAME_CONSTANTS } from '../config.js';

import { refreshIslandMenu } from './index.js';

export function handleIntel() {
  const state = getState();
  setPhase("island_intel");

  const currentTurn = state.day * 8 + state.phaseIndex;
  let statusText = "";
  if (state.intelImmunityEnd && state.intelImmunityEnd > currentTurn) {
    const remainingTurns = state.intelImmunityEnd - currentTurn;
    const remainingDays = Math.ceil(remainingTurns / 8);
    statusText = `\n\n当前情报效果：剩余${remainingTurns}回合（约${remainingDays}天）探索免敌`;
  }

  let desc = "📡 情报中枢\n\n";
  desc += `一个神秘的情报贩子坐在角落，低声说：\"花点钱，我保证你探索时不会遇到任何麻烦。${GAME_CONSTANTS.INTEL.DURATION}个回合内，丧尸和劫匪都不会找上你。\"\n\n`;
  desc += `价格：${GAME_CONSTANTS.INTEL.PRICE}皇家币`;
  desc += statusText;
  desc += `\n\n当前皇家币：${state.royalCoins}`;

  setStory(desc);
  setOptions([
    { text: `购买情报（${GAME_CONSTANTS.INTEL.PRICE}币）`, action: "intel_buy" },
    { text: "离开", action: "intel_leave" },
  ]);
}

export function handleIntelAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  if (action === "intel_buy") {
    handleIntelBuy();
  } else if (action === "intel_continue") {
    handleIntel();
  } else if (action === "intel_leave") {
    refreshIslandMenu();
  } else {
    refreshIslandMenu();
  }
}

function handleIntelBuy() {
  const state = getState();
  if (state.royalCoins < GAME_CONSTANTS.INTEL.PRICE) {
    setStory(`你的皇家币不足。需要${GAME_CONSTANTS.INTEL.PRICE}币，当前只有${state.royalCoins}币。`);
    setPhase("island_intel");
    setOptions([{ text: "继续", action: "intel_continue" }]);
    return;
  }

  removeRoyalCoins(GAME_CONSTANTS.INTEL.PRICE);
  const currentTurn = state.day * 8 + state.phaseIndex;
  const newEnd = currentTurn + GAME_CONSTANTS.INTEL.DURATION;

  if (state.intelImmunityEnd && state.intelImmunityEnd > currentTurn) {
    state.intelImmunityEnd = newEnd;
  } else {
    state.intelImmunityEnd = newEnd;
  }

  const remainingTurns = state.intelImmunityEnd - currentTurn;
  const remainingDays = Math.ceil(remainingTurns / 8);

  setStory(`情报贩子递给你一张标记了安全路线的地图：\"照着走，${GAME_CONSTANTS.INTEL.DURATION}个回合内不会有人找你麻烦。\"\n\n花费 ${GAME_CONSTANTS.INTEL.PRICE} 皇家币\n情报效果：剩余${remainingTurns}回合（约${remainingDays}天）探索免敌\n当前皇家币：${getState().royalCoins}`);

  setPhase("island_intel");
  setOptions([{ text: "继续", action: "intel_continue" }]);
}
