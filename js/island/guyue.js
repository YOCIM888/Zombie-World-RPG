import {
  getState, setPhase, setStory, setOptions,
  addItem, addRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
  addNpcAffinity, getNpcAffinity, getAffinityLabel, getAffinityStage,
  canChatToday, incrementChatCount, formatQualityText,
  removeItemById,
} from '../state.js';

import { GAME_CONSTANTS, AFFINITY_MAX } from '../config.js';

import { GUYUE_DIALOGUES } from '../data/dialogues/map-dialogues.js';
import { FISH_RECYCLE_PRICES } from '../data/items/seafood-meals.js';
import { FISH, FISH_RARITY_WEIGHTS } from '../data/items/fish.js';

import { refreshIslandMenu } from './index.js';

const RARITY_LABELS = { common: "普通", uncommon: "优秀", rare: "稀有", epic: "史诗", legendary: "传说" };

function randomDialogue(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function handleNpcGuyue() {
  const state = getState();
  const affinity = getNpcAffinity("guyue");
  const friendshipLabel = getAffinityLabel(affinity);
  const dialogue = randomDialogue(GUYUE_DIALOGUES);

  let desc = `【岛民顾月】\n一个对国王陛下充满崇敬的岛民，眼中总是闪烁着对王权的狂热。`;
  desc += `\n\n当前好感：${affinity}/${AFFINITY_MAX.guyue}（${friendshipLabel}）`;
  desc += `\n\n${dialogue}`;

  setPhase("island_guyue");
  setStory(desc);
  setOptions([
    { text: "对话", action: "guyue_chat" },
    { text: "回收海鱼", action: "guyue_recycle" },
    { text: "离开", action: "guyue_leave" },
  ]);
}

export function handleGuyueAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "guyue_chat":
      handleGuyueChat();
      break;
    case "guyue_recycle":
      handleGuyueRecycle();
      break;
    case "guyue_recycle_select":
      handleGuyueRecycleSelect();
      break;
    case "guyue_recycle_one":
      handleGuyueRecycleOne(input);
      break;
    case "guyue_recycle_all":
      handleGuyueRecycleAll();
      break;
    case "guyue_recycle_one_continue":
      handleGuyueRecycleSelect();
      break;
    case "guyue_recycle_all_continue":
      showGuyueRecycleMenu();
      break;
    case "guyue_recycle_back":
      handleNpcGuyue();
      break;
    case "guyue_leave":
      refreshIslandMenu();
      break;
    default:
      handleNpcGuyue();
      break;
  }
}

export function handleGuyueChat() {
  const state = getState();
  if (!canChatToday("guyue")) {
    setStory("顾月摆了摆手：'今天已经聊了很多了，改日再叙吧。'");
    handleNpcGuyue();
    return;
  }
  incrementChatCount("guyue");
  addNpcAffinity("guyue", 1);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleNpcGuyue();
}

export function handleGuyueRecycle() {
  const state = getState();
  const fishCount = state.food.filter(i => i.type === "fish").length;
  if (fishCount === 0) {
    setStory("你身上没有海鱼可以回收。");
    handleNpcGuyue();
    return;
  }
  showGuyueRecycleMenu();
}

export function handleGuyueRecycleSelect() {
  const state = getState();
  const fishes = state.food.filter(i => i.type === "fish");
  if (fishes.length === 0) {
    setStory("你身上没有海鱼可以回收。");
    showGuyueRecycleMenu();
    return;
  }
  const opts = fishes.map((f, i) => {
    const rarity = f.rarity || "common";
    const price = FISH_RECYCLE_PRICES[rarity] || 1;
    const label = RARITY_LABELS[rarity] || "普通";
    return { text: `${formatQualityText(f.name, rarity)}【${label}】→ ${price}皇家币`, action: "guyue_recycle_one", index: i };
  });
  opts.push({ text: "返回", action: "guyue_recycle_back" });
  setPhase("island_guyue");
  setStory("选择要回收的海鱼：");
  setOptions(opts);
}

export function handleGuyueRecycleOne(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "guyue_recycle_one") return;

  const fishIdx = option.index;
  const fishes = state.food.filter(i => i.type === "fish");
  if (fishIdx < 0 || fishIdx >= fishes.length) {
    setStory("找不到该海鱼。");
    showGuyueRecycleMenu();
    return;
  }

  const fish = fishes[fishIdx];
  const rarity = fish.rarity || "common";
  const price = FISH_RECYCLE_PRICES[rarity] || 1;
  const label = RARITY_LABELS[rarity] || "普通";

  const realIdx = state.food.indexOf(fish);
  if (realIdx !== -1) {
    state.food.splice(realIdx, 1);
  }

  addRoyalCoins(price);
  setStory(`你回收了${formatQualityText(fish.name, rarity)}【${label}】，获得 ${price} 皇家币。\n\n当前皇家币：${getState().royalCoins}`);
  setPhase("island_guyue");
  setOptions([{ text: "继续", action: "guyue_recycle_one_continue" }]);
}

export function handleGuyueRecycleAll() {
  const state = getState();
  const fishes = state.food.filter(i => i.type === "fish");
  if (fishes.length === 0) {
    setStory("你身上没有海鱼可以回收。");
    showGuyueRecycleMenu();
    return;
  }

  let totalCoins = 0;
  const summary = [];

  for (const fish of fishes) {
    const rarity = fish.rarity || "common";
    const price = FISH_RECYCLE_PRICES[rarity] || 1;
    const label = RARITY_LABELS[rarity] || "普通";
    totalCoins += price;
    summary.push(`${formatQualityText(fish.name, rarity)}【${label}】→ ${price}皇家币`);
  }

  state.food = state.food.filter(i => i.type !== "fish");
  addRoyalCoins(totalCoins);

  setStory(`你回收了所有海鱼，共 ${fishes.length} 条：\n${summary.join("\n")}\n\n总计获得 ${totalCoins} 皇家币。\n当前皇家币：${getState().royalCoins}`);
  setPhase("island_guyue");
  setOptions([{ text: "继续", action: "guyue_recycle_all_continue" }]);
}

function showGuyueRecycleMenu() {
  const state = getState();
  const fishCount = state.food.filter(i => i.type === "fish").length;
  setPhase("island_guyue");
  setStory(fishCount > 0 ? `你身上有${fishCount}条海鱼可以回收。` : "你身上没有海鱼可以回收。");
  setOptions([
    { text: "选择海鱼", action: "guyue_recycle_select", disabled: fishCount === 0 },
    { text: "回收全部", action: "guyue_recycle_all", disabled: fishCount === 0 },
    { text: "离开", action: "guyue_recycle_back" },
  ]);
}
