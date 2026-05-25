import { getState, setPhase, setStory, setOptions, removeCigarettes, advanceTime, updateStatusEffects, checkDeath } from '../state.js';
import { CASTLE_GUARD_DIALOGUES, CASTLE_GUARD_HIGH_DIALOGUES, getDialogueByRank, MAPS } from '../config.js';
import { getCastleRank, getCastleRankName, hasCastleIdentity } from '../faction.js';
import { showExploreOptionsState } from '../routing.js';
import { enterCastleInterior } from './interior.js';

export function handleCastleOutpost() {
  const state = getState();
  if (state.castleDebt && state.day > state.castleDebt.dueDay) {
    const rank = getCastleRank(state);
    const overdueDays = state.day - state.castleDebt.dueDay;
    if (!state.castleDebtTriggered) {
      state.castleDebtTriggered = true;
      state.castleDebt.amount *= 2;
      if (rank >= 2) {
        setStory(`⚠️ 因为没有及时还清债务，你的债务已经翻倍为${state.castleDebt.amount}根香烟。\n\n不过，凭借你的爵位身份，城堡的催收员不敢动你分毫。你受到了城堡的保护，为保持城堡内的信誉，请尽快偿还债务。\n\n债务依然存在：${state.castleDebt.amount}根香烟（已逾期${overdueDays}天）。`);
      } else {
        const foodCount = state.food.reduce((sum, i) => sum + (i.count || 1), 0);
        const drinkCount = state.drinks.reduce((sum, i) => sum + (i.count || 1), 0);
        const medCount = state.medicine.reduce((sum, i) => sum + (i.count || 1), 0);
        const totalConfiscated = foodCount + drinkCount + medCount;
        state.food = [];
        state.drinks = [];
        state.medicine = [];
        setStory(`⚠️ 因为没有及时还清债务，城堡银行的催收员突然冲出来抢走了你的食物、饮品和药品（共${totalConfiscated}件）！他们人多势众，你根本打不过。\n\n债务翻倍为${state.castleDebt.amount}根香烟（已逾期${overdueDays}天）。`);
      }
    } else {
      if (rank >= 2) {
        setStory(`⚠️ 你的债务已逾期${overdueDays}天，当前欠款${state.castleDebt.amount}根香烟。凭借爵位身份，催收员不敢动你分毫，但请尽快偿还。`);
      } else {
        setStory(`⚠️ 你的债务已逾期${overdueDays}天，当前欠款${state.castleDebt.amount}根香烟。催收员随时可能再次上门，请尽快偿还。`);
      }
    }
    setPhase("explore");
    refreshCastleOutpost();
    getState().currentMap = MAPS.find(m => m.id === "末日城堡");
    return;
  }
  setPhase("explore");
  setStory("一座气势磅礴的巍峨城堡赫然横亘在视野尽头，棱角凌厉的石砌塔楼刺破灰蒙蒙的末日天际，厚重斑驳的巨型城墙由整块巨石垒筑而成，墙面上残存着末日前的精致雕纹与战火灼烧的痕迹，无声诉说着昔日极致的辉煌与权力。城堡正门高大肃穆，铁门紧闭，两侧肃立着两名全副武装的守卫。他们身披加固护甲，手持寒光凛冽的制式武器，身形挺拔如松，眼神锐利冰冷如鹰隼，周身散发出不容侵犯的压迫感，正一丝不苟地扫视、甄别着每一个胆敢靠近的幸存者，分毫不敢松懈。城墙外侧的开阔工地上，尘土飞扬，一群衣衫褴褛、面黄肌瘦的幸存者正被驱使着劳作，搬石夯土、修缮工事，在烈日与疲惫下麻木地埋头苦干，汗水浸透单薄的衣物，每一寸辛劳都在堆砌这座末日王国的壁垒。不远处，*卢修斯城堡银行*的鎏金招牌在灰暗天地间格外刺眼，精致的欧式石质建筑透着森严的秩序感。门前与厅堂内，几名衣着华丽、面料考究的贵族从容周旋，他们佩戴着象征身份的饰品，低声交谈、核算筹码，在末世的废墟之上，依旧进行着借贷、交易与权力博弈，贫富与阶层的鸿沟，在此处被展现得淋漓尽致。");
  refreshCastleOutpost();
  getState().currentMap = MAPS.find(m => m.id === "末日城堡");
}

export function refreshCastleOutpost() {
  const state = getState();
  setPhase("explore");
  setOptions([
    { text: "探索", action: "castle_explore_blocked" },
    { text: "进食", action: "eat" },
    { text: "饮水", action: "drink" },
    { text: "医疗", action: "medicine" },
    { text: "装备", action: "equip" },
    { text: "回家", action: "goHome" },
    { text: "丢弃", action: "discard" },
    { text: "城堡守卫", action: "castle_guard" },
    { text: "城堡银行", action: "castle_bank" },
    { text: "身份办理", action: "castle_identity" },
    { text: "城堡工作", action: "castle_work" },
  ]);
  getState().currentMap = MAPS.find(m => m.id === "末日城堡");
}

export function handleCastleExploreBlocked() {
  setStory("城堡守卫监控着这片区域，你鬼鬼祟祟的太可疑了，这里不适合探索。");
  showExploreOptionsState();
}

export function handleGuardChat() {
  const state = getState();
  const rank = getCastleRank(state);
  const line = getDialogueByRank("guard", rank);
  setStory(`守卫对你吆喝道：${line}`);
  setPhase("castle_guard");
  setOptions([
    { text: "对话", action: "guard_chat" },
    { text: "进入城堡", action: "guard_enter" },
    { text: "给小费（1根香烟）", action: "guard_bribe" },
    { text: "离开", action: "guard_leave" },
  ]);
}

export function handleGuardEnter() {
  const state = getState();
  const hasPass = state.other.some(i => i.id === "castle_pass");
  if (hasPass) {
    setStory("你掏出城堡通行证，守卫仔细端详了一番，立刻恭敬地让开了路。\n\n\"有通行证，请进！城堡随时欢迎您。\"");
    enterCastleInterior();
    return;
  }
  const hasId = hasCastleIdentity(state);
  const rank = getCastleRank(state);
  if (hasId) {
    if (rank >= 2) {
      const rankName = getCastleRankName(state);
      setStory(`守卫看到你的${rankName}身份牌，立刻恭敬地让开了一条路。\n\n"${rankName}大人，请进！城堡里一切为您准备就绪。"`);
    } else {
      setStory("你掏出了贵族身份牌，守卫不冷不热地让开了一条路。\n\n你通过了身份验证，来到了末日城堡内。");
    }
    enterCastleInterior();
  } else {
    setStory("守卫冷笑一声：\"没有身份牌也想进城堡？滚滚滚！\"");
    setPhase("castle_guard");
    setOptions([
      { text: "对话", action: "guard_chat" },
      { text: "进入城堡", action: "guard_enter" },
      { text: "给小费（1根香烟）", action: "guard_bribe" },
      { text: "离开", action: "guard_leave" },
    ]);
  }
}

export function handleGuardBribe() {
  const state = getState();
  if (state.cigarettes < 1) {
    setStory("你翻遍了口袋，一根香烟都没有。守卫不耐烦地瞪着你。");
    setPhase("castle_guard");
    setOptions([
      { text: "对话", action: "guard_chat" },
      { text: "进入城堡", action: "guard_enter" },
      { text: "给小费（1根香烟）", action: "guard_bribe" },
      { text: "离开", action: "guard_leave" },
    ]);
    return;
  }
  removeCigarettes(1);
  setStory("你偷偷往守卫手里塞了一根香烟。守卫不动声色地收进口袋，朝你挤了挤眼：\"进去吧，别惹事！\"\n\n你通过贿赂守卫，偷偷摸摸地进入了城堡内。");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) enterCastleInterior();
}

export function handleGuardLeave() {
  setStory("你离开了城堡大门。");
  showExploreOptionsState();
}

export function handleCastleGuard() {
  const state = getState();
  const rank = getCastleRank(state);
  let greeting;
  if (rank === 0) {
    greeting = "一个满脸横肉的守卫上下打量着你：\"干嘛的？\"";
  } else if (rank === 1) {
    greeting = "守卫扫了一眼你的贵族身份牌，语气平淡：\"进去吧，别惹事。\"";
  } else {
    greeting = `守卫看到你的${getCastleRankName(state)}身份牌，立刻挺直了身子：\"大人，请进！\"`;
  }
  setPhase("castle_guard");
  setStory(greeting);
  setOptions([
    { text: "对话", action: "guard_chat" },
    { text: "进入城堡", action: "guard_enter" },
    { text: "给小费（1根香烟）", action: "guard_bribe" },
    { text: "离开", action: "guard_leave" },
  ]);
}

export function handleCastleGuardAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "guard_chat") { handleGuardChat(); return; }
  if (action === "guard_enter") { handleGuardEnter(); return; }
  if (action === "guard_bribe") { handleGuardBribe(); return; }
  if (action === "guard_leave") { handleCastleOutpost(); return; }
}
