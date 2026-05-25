import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, addItem, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { GAME_CONSTANTS, RANGED_WEAPONS } from '../config.js';

import { refreshIslandMenu } from './index.js';

function getRandomUncommonRanged() {
  const uncommon = RANGED_WEAPONS.filter(w => w.rarity === "uncommon");
  if (uncommon.length === 0) return null;
  return uncommon[Math.floor(Math.random() * uncommon.length)];
}

function checkBlackMarketRefresh(state) {
  const bm = state.blackMarket;
  if (!bm || !bm.weaponId) return true;
  const daysSinceRefresh = state.day - bm.refreshDay;
  return daysSinceRefresh >= GAME_CONSTANTS.BLACK_MARKET.REFRESH_DAYS;
}

function generateBlackMarketItem(state) {
  const weapon = getRandomUncommonRanged();
  if (!weapon) return null;
  const min = GAME_CONSTANTS.BLACK_MARKET.PRICE_MIN_MULTIPLIER;
  const max = GAME_CONSTANTS.BLACK_MARKET.PRICE_MAX_MULTIPLIER;
  const multiplier = min + Math.random() * (max - min);
  const price = Math.round(weapon.damage * multiplier);
  return {
    weaponId: weapon.id,
    price,
    refreshDay: state.day,
  };
}

export function handleBlackMarket() {
  const state = getState();
  setPhase("island_black_market");

  if (checkBlackMarketRefresh(state)) {
    if (!state.blackMarket || !state.blackMarket.weaponId) {
      state.blackMarket = generateBlackMarketItem(state);
    } else {
      state.blackMarket = generateBlackMarketItem(state);
    }
  }

  const bm = state.blackMarket;
  if (!bm || !bm.weaponId) {
    setStory("🏴‍☠️ 皇家黑市\n\n一个戴着面具的商人站在阴影中，低声说：\"今天没有好货，改天再来吧。\"");
    setOptions([{ text: "离开", action: "bm_leave" }]);
    return;
  }

  const weapon = RANGED_WEAPONS.find(w => w.id === bm.weaponId);
  if (!weapon) {
    setStory("🏴‍☠️ 皇家黑市\n\n商人摇了摇头：\"货出了点问题，改天再来吧。\"");
    setOptions([{ text: "离开", action: "bm_leave" }]);
    return;
  }

  let desc = "🏴‍☠️ 皇家黑市\n\n";
  desc += `一个戴着面具的商人从阴影中走出，低声说：\"看看这个，好货不等人。\"\n\n`;
  desc += `【${weapon.name}】\n`;
  desc += `伤害：${weapon.damage}\n`;
  desc += `弹药类型：${weapon.ammoType}\n`;
  desc += `暴击率：${Math.round(weapon.critRate * 100)}%\n`;
  desc += `一口价：${bm.price}皇家币\n\n`;
  desc += `当前皇家币：${state.royalCoins}`;

  setStory(desc);
  setOptions([
    { text: `购买（${bm.price}币）`, action: "bm_buy" },
    { text: "离开", action: "bm_leave" },
  ]);
}

export function handleBlackMarketAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  if (action === "bm_buy") {
    handleBlackMarketBuy();
  } else if (action === "bm_continue") {
    handleBlackMarket();
  } else if (action === "bm_leave") {
    refreshIslandMenu();
  } else {
    refreshIslandMenu();
  }
}

function handleBlackMarketBuy() {
  const state = getState();
  const bm = state.blackMarket;
  if (!bm || !bm.weaponId) {
    handleBlackMarket();
    return;
  }

  const weapon = RANGED_WEAPONS.find(w => w.id === bm.weaponId);
  if (!weapon) {
    handleBlackMarket();
    return;
  }

  if (state.royalCoins < bm.price) {
    setStory(`你的皇家币不足。需要${bm.price}币，当前只有${state.royalCoins}币。`);
    setPhase("island_black_market");
    setOptions([{ text: "继续", action: "bm_continue" }]);
    return;
  }

  removeRoyalCoins(bm.price);
  const weaponCopy = { ...weapon, integrity: weapon.integrity };
  addItem(weaponCopy);

  setStory(`商人将${weapon.name}递给你：\"好眼光，这把不会让你失望的。记住，我们没见过面。\"\n\n花费 ${bm.price} 皇家币，获得 ${weapon.name}\n当前皇家币：${getState().royalCoins}`);

  state.blackMarket = { refreshDay: bm.refreshDay };

  setPhase("island_black_market");
  setOptions([{ text: "继续", action: "bm_continue" }]);
}
