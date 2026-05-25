import {
  getState,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  setPhase,
  setStory,
  setOptions,
  consumeItem,
  resetCrashTurns,
  getItemDisplayName,
} from '../state.js';

import {
  GAME_CONSTANTS,
} from '../config.js';

import { showHomeOptions, returnToMenu } from '../routing.js';

import { getBaseBonus } from '../base.js';

export function handleSleep() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    setStory("你身体已经完全疲惫不堪了，根本无法入睡。你的身体酸痛无力。你可以先使用医疗物品（如止痛片、肾上腺素）恢复精神状态。");
    showHomeOptions();
    return;
  }
  if (state.hunger <= 0) {
    setStory("你太饿了，根本无法入睡。先吃点东西吧。");
    showHomeOptions();
    return;
  }
  if (state.hydration <= 0) {
    setStory("你太渴了，根本无法入睡。先喝点东西吧。");
    showHomeOptions();
    return;
  }
  resetCrashTurns();
  const reduction = Math.floor(Math.random() * (GAME_CONSTANTS.SLEEP.FATIGUE_REDUCTION_MAX - GAME_CONSTANTS.SLEEP.FATIGUE_REDUCTION_MIN + 1)) + GAME_CONSTANTS.SLEEP.FATIGUE_REDUCTION_MIN;
  state.crash = Math.max(0, state.crash - reduction);
  state.sanity = Math.min(GAME_CONSTANTS.SANITY_MAX, state.sanity + GAME_CONSTANTS.SLEEP.SANITY_RECOVERY);
  const healthRecovery = Math.floor(Math.random() * (GAME_CONSTANTS.SLEEP.HEALTH_RECOVERY_MAX - GAME_CONSTANTS.SLEEP.HEALTH_RECOVERY_MIN + 1)) + GAME_CONSTANTS.SLEEP.HEALTH_RECOVERY_MIN + getBaseBonus(state.baseLevel);
  state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + healthRecovery);
  advanceTime(GAME_CONSTANTS.SLEEP.TIME_COST);
  updateStatusEffects();
  setStory(`你沉沉睡去，醒来后感觉身体好了一些。疲惫减轻了${reduction}%，健康恢复了${healthRecovery}点，理智恢复了${GAME_CONSTANTS.SLEEP.SANITY_RECOVERY}点。`);
  checkDeath();
  if (!state.gameOver) showHomeOptions();
}

export function handleEatSelect() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    setStory("你身体已经完全疲惫不堪了，根本不想吃任何东西。你对一切都失去了兴趣。你可以先使用医疗物品（如止痛片、肾上腺素）恢复精神状态。");
    returnToMenu();
    return;
  }
  if (state.food.length === 0) {
    setStory("你没有食物可以吃。");
    returnToMenu();
    return;
  }
  setPhase("eat_select");
  setStory("请选择要食用的食物：");
  const foodOptions = state.food.map((f, i) => {
    let info = `（饱腹+${f.hunger || 0}`;
    if (f.hydration) info += ` 水分+${f.hydration}`;
    if (f.effects) {
      if (f.effects.health) info += ` 生命+${f.effects.health}`;
      if (f.effects.infection) info += ` 感染${f.effects.infection > 0 ? "+" : ""}${f.effects.infection}`;
      if (f.effects.crash) info += ` 疲劳${f.effects.crash > 0 ? "+" : ""}${f.effects.crash}`;
            if (f.effects.sanity) info += ` 理智${f.effects.sanity > 0 ? "+" : ""}${f.effects.sanity}`;
    }
    info += "）";
    return { text: getItemDisplayName(f) + info, action: "eat_food", index: i };
  });
  foodOptions.push({ text: "返回", action: "back", index: -1 });
  setOptions(foodOptions);
}

export function handleDrinkSelect() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    setStory("你身体已经完全疲惫不堪了，根本不想喝任何东西。你可以先使用医疗物品恢复状态。");
    returnToMenu();
    return;
  }
  if (state.drinks.length === 0) {
    setStory("你没有饮品可以喝。");
    returnToMenu();
    return;
  }
  setPhase("drink_select");
  setStory("请选择要饮用的饮品：");
  const drinkOptions = state.drinks.map((d, i) => {
    let info = `（水分+${d.hydration}`;
    if (d.effects && d.effects.crash) info += ` 疲劳${d.effects.crash > 0 ? "+" : ""}${d.effects.crash}`;
        if (d.effects && d.effects.sanity) info += ` 理智${d.effects.sanity > 0 ? "+" : ""}${d.effects.sanity}`;
    info += "）";
    return { text: getItemDisplayName(d) + info, action: "drink_item", index: i };
  });
  drinkOptions.push({ text: "返回", action: "back", index: -1 });
  setOptions(drinkOptions);
}

export function handleMedicineSelect() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    const usableMeds = state.medicine.filter(m => m.effects && (m.effects.crash && m.effects.crash < 0) || (m.effects.sanity && m.effects.sanity > 0));
    if (usableMeds.length === 0) {
      setStory("你身体已经完全疲惫不堪了，无法使用医疗物品。你可以先寻找他人帮助恢复精神状态。");
      returnToMenu();
      return;
    }
    setPhase("medicine_select");
    setStory("你身体已经完全疲惫不堪了，只有能恢复状态的物品可以使用。请选择要使用的医疗物品：");
    const medOptions = usableMeds.map((m, i) => {
      const effects = [];
      if (m.effects) {
        if (m.effects.health) effects.push(`生命+${m.effects.health}`);
        if (m.effects.infection) effects.push(`感染${m.effects.infection > 0 ? "+" : ""}${m.effects.infection}`);
        if (m.effects.crash) effects.push(`疲劳${m.effects.crash > 0 ? "+" : ""}${m.effects.crash}`);
        if (m.effects.sanity) effects.push(`理智${m.effects.sanity > 0 ? "+" : ""}${m.effects.sanity}`);
        if (m.effects.hydration) effects.push(`水分+${m.effects.hydration}`);
      }
      return { text: getItemDisplayName(m) + (effects.length > 0 ? `（${effects.join(" ")}）` : ""), action: "use_med", index: state.medicine.indexOf(m) };
    });
    medOptions.push({ text: "返回", action: "back", index: -1 });
    setOptions(medOptions);
    return;
  }
  if (state.medicine.length === 0) {
    setStory("你没有医疗物品可用。");
    returnToMenu();
    return;
  }
  setPhase("medicine_select");
  setStory("请选择要使用的医疗物品：");
  const medOptions = state.medicine.map((m, i) => {
    const effects = [];
    if (m.effects) {
      if (m.effects.health) effects.push(`生命+${m.effects.health}`);
      if (m.effects.infection) effects.push(`感染${m.effects.infection > 0 ? "+" : ""}${m.effects.infection}`);
      if (m.effects.crash) effects.push(`疲劳${m.effects.crash > 0 ? "+" : ""}${m.effects.crash}`);
      if (m.effects.sanity) effects.push(`理智${m.effects.sanity > 0 ? "+" : ""}${m.effects.sanity}`);
      if (m.effects.hydration) effects.push(`水分+${m.effects.hydration}`);
    }
    return { text: getItemDisplayName(m) + (effects.length > 0 ? `（${effects.join(" ")}）` : ""), action: "use_med", index: i };
  });
  medOptions.push({ text: "返回", action: "back", index: -1 });
  setOptions(medOptions);
}

export function handleFoodAction(input) {
  handleSelectionPhase(input, "food", "食物", true);
}

export function handleDrinkAction(input) {
  handleSelectionPhase(input, "drinks", "饮品", true);
}

export function handleMedicineAction(input) {
  handleSelectionPhase(input, "medicine", "医疗物品", true);
}

export function handleSelectionPhase(input, key, label, consume) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    returnToMenu();
    return;
  }

  if (consume && state[key] && state[key][option.index]) {
    const item = state[key][option.index];
    const result = consumeItem(key, option.index);
    if (result) {
      let msg = `你使用了${getItemDisplayName(item)}。`;
      if (result.hunger) msg += ` 饱腹+${result.hunger}`;
      if (result.hydration) msg += ` 水分+${result.hydration}`;
      if (result.effects?.health) msg += ` 生命+${result.effects.health}`;
      if (result.effects?.infection) msg += ` 感染${result.effects.infection > 0 ? '+' : ''}${result.effects.infection}`;
      if (result.effects?.crash) msg += ` 疲劳${result.effects.crash > 0 ? '+' : ''}${result.effects.crash}`;
            if (result.effects?.sanity) msg += ` 理智${result.effects.sanity > 0 ? '+' : ''}${result.effects.sanity}`;
      setStory(msg);
      updateStatusEffects();
      checkDeath();
      const updatedState = getState();
      if (updatedState.gameOver) return;
      if (updatedState[key] && updatedState[key].length > 0) {
        if (key === "food") handleEatSelect();
        else if (key === "drinks") handleDrinkSelect();
        else if (key === "medicine") handleMedicineSelect();
        else returnToMenu();
      } else {
        returnToMenu();
      }
    } else {
      setStory("操作无效");
      returnToMenu();
    }
  }
}
