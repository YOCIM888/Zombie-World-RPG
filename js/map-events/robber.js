import {
  getState,
  setPhase,
  setStory,
  setOptions,
  removeRoyalCoins,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import { GAME_CONSTANTS } from '../config.js';

export function checkRobberEncounter(state) {
  const map = state.currentMap;
  if (map && GAME_CONSTANTS.ROBBER.SAFE_MAP_IDS.includes(map.id)) {
    return false;
  }
  const coins = state.royalCoins;
  const thresholds = GAME_CONSTANTS.ROBBER.THRESHOLDS;
  let rate = 0;
  for (const t of thresholds) {
    if (coins >= t.minCoins && coins <= t.maxCoins) {
      rate = t.rate;
      break;
    }
  }
  if (rate <= 0) return false;
  return Math.random() < rate;
}

export function handleRobberEncounter() {
  const state = getState();
  const robbedAmount = Math.round(state.royalCoins * GAME_CONSTANTS.ROBBER.ROB_RATE);
  if (robbedAmount <= 0) return false;
  removeRoyalCoins(robbedAmount);
  const eventText = GAME_CONSTANTS.ROBBER.EVENT_TEXT.replace('{amount}', robbedAmount);
  setPhase("robber_event");
  setStory(eventText);
  setOptions([{ text: "继续", action: "robber_continue" }]);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  return true;
}
