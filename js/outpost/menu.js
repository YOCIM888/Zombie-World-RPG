import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addCigarettes,
  removeCigarettes,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  canBegToday,
  markBegDone,
  addAmmo,
} from '../state.js';

import {
  FRUITS,
  GAME_CONSTANTS,
  DRINKS,
  MEDICINES,
  CROP_FOOD_MAP,
} from '../config.js';

import {
  hasDawnCaptainBadge,
  hasCastleIdentity,
  cleanDualIdentity,
} from '../faction.js';

export function showOutpostOptions() {
  if (getState().gameOver) return;
  setPhase("explore");
  const state = getState();
  const opts = [
    { text: "探索", action: "outpost_explore" },
    { text: "进食", action: "eat" },
    { text: "饮水", action: "drink" },
    { text: "医疗", action: "medicine" },
    { text: "装备", action: "equip" },
    { text: "回家", action: "goHome" },
    { text: "丢弃", action: "discard" },
    { text: "V小姐", action: "npc_v" },
    { text: "苏小涵", action: "npc_xiaohan" },
    { text: "莉莉丝", action: "npc_lili" },
    { text: "沐苗苗", action: "npc_mumiao" },
    { text: "阵地首领", action: "npc_leader" }
  ];
  opts.push({ text: "轻松打工", action: "work" });
  opts.push({ text: "乞讨物资", action: "beg_supplies" });
  opts.push({ text: "曙光交易站", action: "trading_post" });
  opts.push({ text: "物资征集处", action: "collection_point" });
  setOptions(opts);
}

export function handleOutpostExplore() {
  setStory("你四处张望了一下——这里是别人的地盘，偷东西不好吧。");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  showOutpostOptions();
}

export function handleBegSupplies() {
  const state = getState();
  cleanDualIdentity(state);
  if (hasCastleIdentity(state)) {
    setStory("阵地管理员瞥了你一眼：\"哼，城堡的人还来我们这讨饭？要不要脸！\" 周围的人投来鄙夷的目光，你只好灰溜溜地走开。");
    showOutpostOptions();
    return;
  }
  if (!canBegToday()) {
    setStory("今天已经领取了救济，明天再来吧。");
    showOutpostOptions();
    return;
  }
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  const added1 = addItem({ ...fruit });

  const hasCaptain = hasDawnCaptainBadge(state);
  if (hasCaptain) {
    const fruit2 = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const added2 = addItem({ ...fruit2 });
    if (added1 || added2) {
      markBegDone();
      setStory(`曙光先锋队长的身份让你多领了一份救济！阵地管理员递给你${fruit.name}和${fruit2.name}。"队长大人，请慢用！"`);
    } else {
      setStory("你的背包已满，无法领取救济物资。");
    }
  } else {
    if (added1) {
      markBegDone();
      setStory(`阵地管理员递给你一份${fruit.name}。"省着点吃，明天再来。"`);
    } else {
      setStory("你的背包已满，无法领取救济物资。");
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  showOutpostOptions();
}

export function handleTradingPost() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  setPhase("explore");
  let info = "🏪 【曙光交易站】\n\n阵地后勤官管理着一个小型物资交易站：\"这些都是我们从各地搜刮来的，只收香烟。\"\n\n";
  info += `当前香烟：${state.cigarettes}\n\n`;
  info += "商品列表：\n";
  const prices = OC.TRADING_POST;
  const ammoAmounts = OC.TRADING_POST_AMMO;
  for (const [name, price] of Object.entries(prices)) {
    const ammoAmount = ammoAmounts[name];
    const extra = ammoAmount ? `（${ammoAmount}发）` : "";
    info += `  ${name}${extra} - ${price}香烟\n`;
  }
  setStory(info);
  const opts = [];
  for (const [name, price] of Object.entries(prices)) {
    const ammoAmount = ammoAmounts[name];
    const extra = ammoAmount ? `（${ammoAmount}发）` : "";
    opts.push({ text: `购买${name}${extra}（${price}香烟）`, action: "trading_post_buy", item: name, price });
  }
  opts.push({ text: "离开", action: "trading_post_back" });
  setOptions(opts);
}

export function handleTradingPostBuy(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "trading_post_buy") return;
  const { item, price } = option;
  if (state.cigarettes < price) {
    setStory(`❌ 你的香烟不足，需要${price}支香烟，当前只有${state.cigarettes}支。`);
    handleTradingPost();
    return;
  }
  const OC = GAME_CONSTANTS.OUTPOST;
  const ammoAmount = OC.TRADING_POST_AMMO[item];
  if (ammoAmount) {
    removeCigarettes(price);
    addAmmo(item, ammoAmount);
    setStory(`✅ 你花费${price}支香烟购买了${ammoAmount}发${item}。\n\n当前香烟：${state.cigarettes}`);
  } else {
    let added = false;
    const drink = DRINKS.find(d => d.id === item);
    if (drink) {
      added = addItem({ ...drink });
    }
    if (!added) {
      const med = MEDICINES.find(m => m.id === item);
      if (med) {
        added = addItem({ ...med });
      }
    }
    if (!added) {
      setStory("❌ 购买失败，背包可能已满。");
      handleTradingPost();
      return;
    }
    removeCigarettes(price);
    setStory(`✅ 你花费${price}支香烟购买了${item}。\n\n当前香烟：${state.cigarettes}`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleTradingPost();
}

export function handleCollectionPoint() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  setPhase("explore");
  let fruitCount = 0;
  for (const item of state.food) {
    if (item.type === "fruit") fruitCount += (item.count || 1);
  }
  let cropCount = 0;
  for (const item of state.food) {
    if (item.type === "food" && CROP_FOOD_MAP[item.id]) {
      cropCount += (item.count || 1);
    }
  }
  setStory(`📦 【物资征集处】\n\n曙光阵地正在征集民间物资，可用农产品换取香烟。\n\n📌 兑换规则：\n  ${OC.COLLECTION_FRUIT_COST}个水果 → ${OC.COLLECTION_REWARD}香烟\n  ${OC.COLLECTION_CROP_COST}个作物 → ${OC.COLLECTION_REWARD}香烟\n\n📦 当前持有：\n  水果：${fruitCount}个\n  作物：${cropCount}个\n  香烟：${state.cigarettes}支`);
  setOptions([
    { text: `上交${OC.COLLECTION_FRUIT_COST}个水果 → ${OC.COLLECTION_REWARD}香烟`, action: "collection_fruit" },
    { text: `上交${OC.COLLECTION_CROP_COST}个作物 → ${OC.COLLECTION_REWARD}香烟`, action: "collection_crop" },
    { text: "离开", action: "collection_back" },
  ]);
}

export function handleCollectionFruit() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  let fruitCount = 0;
  for (const item of state.food) {
    if (item.type === "fruit") fruitCount += (item.count || 1);
  }
  if (fruitCount < OC.COLLECTION_FRUIT_COST) {
    setStory(`❌ 你的水果不足，需要${OC.COLLECTION_FRUIT_COST}个，当前只有${fruitCount}个。`);
    handleCollectionPoint();
    return;
  }
  let remaining = OC.COLLECTION_FRUIT_COST;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    if (state.food[i].type === "fruit") {
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        remaining -= available;
        state.food.splice(i, 1);
      } else {
        state.food[i].count -= remaining;
        remaining = 0;
      }
    }
  }
  addCigarettes(OC.COLLECTION_REWARD);
  setStory(`✅ 你上交了${OC.COLLECTION_FRUIT_COST}个水果，获得${OC.COLLECTION_REWARD}支香烟。\n\n当前香烟：${state.cigarettes}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleCollectionPoint();
}

export function handleCollectionCrop() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  let cropCount = 0;
  for (const item of state.food) {
    if (item.type === "food" && CROP_FOOD_MAP[item.id]) {
      cropCount += (item.count || 1);
    }
  }
  if (cropCount < OC.COLLECTION_CROP_COST) {
    setStory(`❌ 你的作物不足，需要${OC.COLLECTION_CROP_COST}个，当前只有${cropCount}个。`);
    handleCollectionPoint();
    return;
  }
  let remaining = OC.COLLECTION_CROP_COST;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    if (state.food[i].type === "food" && CROP_FOOD_MAP[state.food[i].id]) {
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        remaining -= available;
        state.food.splice(i, 1);
      } else {
        state.food[i].count -= remaining;
        remaining = 0;
      }
    }
  }
  addCigarettes(OC.COLLECTION_REWARD);
  setStory(`✅ 你上交了${OC.COLLECTION_CROP_COST}个作物，获得${OC.COLLECTION_REWARD}支香烟。\n\n当前香烟：${state.cigarettes}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleCollectionPoint();
}
