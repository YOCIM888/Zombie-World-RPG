import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  formatQualityText,
} from '../state.js';

import {
  FISH,
  SPECIAL_ITEMS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

/**
 * 市中心综合商场 - 漏电玻璃缸主入口
 */
export function handleElectroTank() {
  setPhase("explore");
  setStory(
    "商场角落有一个巨大的玻璃缸，缸壁上布满了青苔和裂纹。\n" +
    "缸内的水浑浊不清，隐约能看到几根裸露的电线在水中摇曳，发出滋滋的电流声。\n" +
    "水面上漂浮着几条早已翻白的小鱼——看来普通的鱼根本无法在这带电的水中存活。\n" +
    "你注意到缸底有几片泛着微光的鳞片，似乎蕴藏着某种能量……"
  );
  showElectroOptions();
}

/**
 * 展示玻璃缸子选项（不覆盖当前 story）
 */
function showElectroOptions() {
  setOptions([
    { text: "投放鱼类", action: "electro_throw_fish" },
    { text: "用手触摸", action: "electro_touch" },
    { text: "离开", action: "electro_leave" },
  ]);
}

/**
 * 投放鱼类 - 选择要投放的鱼
 */
export function handleElectroThrowFish() {
  const state = getState();
  const fishInBag = state.food.filter(f => f.type === "fish");

  if (fishInBag.length === 0) {
    setStory("你翻遍了背包，一条鱼都没有。也许该去岛屿钓些鱼再来。");
    setOptions([
      { text: "用手触摸", action: "electro_touch" },
      { text: "离开", action: "electro_leave" },
    ]);
    return;
  }

  setPhase("explore");
  setStory("请选择你要投放的鱼类：");
  const opts = fishInBag.map((f, i) => ({
    text: `${f.name} ×${f.count || 1}`,
    action: "electro_fish_confirm",
    fishIndex: i,
    fishId: f.id,
  }));
  opts.push({ text: "返回", action: "electro_tank" });
  setOptions(opts);
}

/**
 * 确认投放某条鱼
 */
export function handleElectroFishConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "electro_tank") {
    handleElectroTank();
    return;
  }

  const fishDef = FISH.find(f => f.id === option.fishId);
  if (!fishDef) {
    handleElectroTank();
    return;
  }

  // 消耗1条鱼
  const fishInBag = state.food.filter(f => f.type === "fish" && f.id === option.fishId);
  if (fishInBag.length === 0) {
    setStory("背包中找不到该鱼，也许已经被消耗了。");
    handleElectroTank();
    return;
  }
  const fishItem = fishInBag[0];
  if ((fishItem.count || 1) > 1) {
    fishItem.count--;
  } else {
    const idx = state.food.indexOf(fishItem);
    if (idx !== -1) state.food.splice(idx, 1);
  }

  let storyMsg;
  const rarity = fishDef.rarity;

  if (rarity === "epic") {
    const scale = { ...SPECIAL_ITEMS.lightning_scale };
    addItem(scale);
    storyMsg =
      `你将【${formatQualityText(fishDef.name, rarity)}】轻轻放入玻璃缸中……\n\n` +
      `鱼入水的瞬间，电光四溅！滋滋作响的电流缠绕在鱼身上，却没有将它电死。\n` +
      `${formatQualityText(fishDef.name, rarity)}在电流中剧烈颤动，鳞片开始折射出耀眼的蓝白色光芒。\n` +
      `片刻之后，鱼沉入缸底，一片闪烁着电弧的鳞片缓缓浮了上来——\n\n` +
      `✨ 获得特殊物品：${formatQualityText(SPECIAL_ITEMS.lightning_scale.name, "epic")}！`;
  } else if (rarity === "legendary") {
    const scale = { ...SPECIAL_ITEMS.thunder_scale };
    addItem(scale);
    storyMsg =
      `你将【${formatQualityText(fishDef.name, rarity)}】放入玻璃缸中……\n\n` +
      `轰——！\n` +
      `整缸水瞬间沸腾！狂暴的电流如龙蛇般在水中狂舞，${formatQualityText(fishDef.name, rarity)}的身躯被雷霆包裹。\n` +
      `它非但没有死去，反而在雷电中蜕变——鳞片剥落，凝聚成一片暗金色的鳞片。\n` +
      `当水面重新平静，那片鳞片静静地浮在水面上，隐隐传来低沉的雷声——\n\n` +
      `⚡ 获得特殊物品：${formatQualityText(SPECIAL_ITEMS.thunder_scale.name, "legendary")}！`;
  } else {
    storyMsg =
      `你将【${formatQualityText(fishDef.name, rarity)}】放进玻璃缸……\n\n` +
      `噼啪！电流瞬间穿透了鱼身。${formatQualityText(fishDef.name, rarity)}剧烈抽搐了几下，翻起了白肚皮。\n` +
      `看来需要更好的品种才能在这带电的水中存活。`;
  }

  setStory(storyMsg);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showElectroOptions();
  }
}

/**
 * 用手触摸玻璃缸
 */
export function handleElectroTouch() {
  const state = getState();

  if (Math.random() < 0.5) {
    state.health = Math.max(0, state.health - 50);
    setStory(
      "你伸手触碰了玻璃缸壁……\n\n" +
      "滋滋——！！\n" +
      "一股强烈的电流瞬间击穿了你的手臂！你被弹开数米远，浑身麻痹。\n" +
      "手臂上留下了一道焦黑的灼痕，疼痛钻心。\n\n" +
      `[系统] 你受到电击伤害 ❤️ -50（当前健康度：${state.health}/${GAME_CONSTANTS.MAX_HEALTH}）`
    );
  } else {
    setStory(
      "你小心翼翼地用手指碰了一下玻璃缸壁——\n\n" +
      "出乎意料，只是微微有些发麻，并没有什么特别的感觉。\n" +
      "缸里的水依旧浑浊，电线还在滋滋作响。\n" +
      "这片鳞片的光芒让你觉得它们不简单，也许该找懂行的人问问。\n\n" +
      `[系统] 未受伤害（当前健康度：${state.health}/${GAME_CONSTANTS.MAX_HEALTH}）`
    );
  }

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showElectroOptions();
  }
}

/**
 * 离开玻璃缸
 */
export function handleElectroLeave() {
  setStory("你转身离开了那个滋滋作响的玻璃缸，电光在身后渐渐隐去。");
  showExploreOptionsState();
}
