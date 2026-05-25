import {
  getState,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  setLocation,
  setCurrentMap,
  setPhase,
  setStory,
  setOptions,
} from '../state.js';

import {
  MAPS,
  MAP_DESCRIPTIONS,
  GAME_CONSTANTS,
} from '../config.js';

import { showHomeOptions, showExploreOptionsState } from '../routing.js';

import { checkGoHomeEnding } from './endings.js';

import { handleCastleOutpost } from '../castle/index.js';

export function handleGoOut() {
  setPhase("map_select");
  setStory("请选择你要前往的地点：");
  const mapOptions = MAPS.filter(m => !m.hidden).map(m => ({
    text: `${m.name} [${m.danger}]`,
    action: "select_map",
    map: m
  }));
  mapOptions.push({ text: "返回", action: "back", map: null });
  setOptions(mapOptions);
}

export function handleGoHome() {
  const state = getState();

  if (checkGoHomeEnding()) return;

  // 理智归零时，在外面出现幻觉无法回家
  if (state.sanity <= 0 && state.location !== "幸存者帐篷") {
    setStory("眼前的世界变得扭曲而陌生——建筑物的轮廓在不停蠕动，天空的颜色在疯狂闪烁，地面仿佛在脚下起伏……\n\n你试着辨认方向，但每一次看到的都是不同的景象。熟悉的道路延伸向陌生的黑暗，回家的方向在幻觉中被彻底抹去。\n\n（理智归零时出现严重幻觉，无法辨认回家的路。请先使用镇静剂恢复理智。）");
    return;
  }

  setLocation("幸存者帐篷");
  setCurrentMap(null);
  state.currentSubMap = null;
  advanceTime(1);
  updateStatusEffects();
  setStory("经过几个小时的路程，和避开路上的丧尸，你终于安全返回了你的幸存者小家。");
  checkDeath();
  if (!state.gameOver) showHomeOptions();
}

export function handleMapAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) {
    return;
  }

  const option = state.options[optionIndex];
  if (option.action === "back") {
    showHomeOptions();
    return;
  }

  const map = option.map;
  if (!map) {
    return;
  }

  setCurrentMap(map);
  setLocation(map.name);

  const mapId = map.id;
  if (!state.stats.mapsExplored) state.stats.mapsExplored = [];
  if (!state.stats.mapsExplored.includes(mapId)) {
    state.stats.mapsExplored.push(mapId);
  }

  if (map.id === "末日城堡") {
    setStory("你来到了末日城堡的大门前。");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      handleCastleOutpost();
    }
    return;
  }

  let entryMsg = MAP_DESCRIPTIONS[map.id] || `你已进入${map.name}。`;
  for (const [key, msg] of Object.entries(GAME_CONSTANTS.MAP.DANGER_MESSAGES)) {
    if (map.danger.includes(key)) {
      entryMsg += msg;
      break;
    }
  }
  setStory(entryMsg);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}
