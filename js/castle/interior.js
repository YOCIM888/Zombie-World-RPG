import { getState, setPhase, setStory, setOptions, addItem, advanceTime, updateStatusEffects, checkDeath, getItemDisplayName } from '../state.js';
import { FOODS, DRINKS, FRUITS, GAME_CONSTANTS, UNDERGROUND_STORY, SPECIAL_ITEMS, NAMED_NPCS, MAP_NPC_INTROS } from '../config.js';
import { getCastleRank, getCastleRankName, hasCastleIdentity } from '../faction.js';
import { showExploreOptionsState } from '../routing.js';
import { handleEatSelect, handleDrinkSelect, handleMedicineSelect, handleGoOut } from '../game/index.js';
import { handleEquipSelect, handleDiscardSelect } from '../equipment.js';
import { refreshCastleOutpost } from './outpost.js';
import { handleCastleKing, handleCastleQueen, handleQueenLateApology, handleQueenPast, handleQueenQuest1, handleQueenQuest2, handleQueenQuest3, handleQueenQuest4, handleCastleBanquet, handleCastleBall, handleCastleRoom, handleCastleSalary, handleKingUnderground, handleKingTradeAWM, handleRoyalTrade, handleRoyalExchange, handleExchangeGouqi, handleExchangeSword, handleRoyalShop, handleRoyalShopBuy } from './royalty.js';
import { handleCastleTreatment, handleTreatConfirm, handleCastleMeeting, handleCastleGarden, handleCastleTitleReissue } from './services.js';
import { handleCastleKingQuest, handleKingQuestSubmit } from './king-quest.js';

export function enterCastleInterior() {
  const state = getState();
  state.currentSubMap = "城堡内部";
  showCastleInterior();
}

export function showCastleInterior() {
  const state = getState();
  state.currentSubMap = "城堡内部";
  setPhase("castle_interior");
  const acidBlock = state.weather === "酸雨";
  setStory("穿过厚重的城堡城门，你踏入了城堡内部，开阔宏伟的主大厅灯火通明，摇曳的暖光将每一处雕梁画栋尽数照亮，精致的大理石地面光洁如镜，穹顶悬挂着巨型水晶吊灯，奢华气派丝毫不减末日前的鼎盛，衣着华贵的贵族与身居高位的高官们齐聚于此，身着剪裁考究的华丽礼服，佩戴着金银珠宝与象征权位的徽章，推杯换盏、谈笑风生，精致的酒水与餐点摆满长桌，欢声笑语在大厅内回荡，奢靡慵懒的氛围扑面而来，仿佛外面肆虐的丧尸、绝望的废土世界，从未降临过这片被高墙隔绝的天地。");
  refreshCastleInterior();
}

export function refreshCastleInterior() {
  const state = getState();
  setPhase("castle_interior");
  const acidBlock = state.weather === "酸雨";
  const opts = [
    { text: "探索", action: "castle_interior_explore" },
    { text: "进食", action: "eat" },
    { text: "饮水", action: "drink" },
    { text: "医疗", action: "medicine" },
    { text: "装备", action: "equip" },
    { text: "丢弃", action: "discard" },
    { text: acidBlock ? "离开（酸雨无法离开）" : "离开", action: "leave_castle_interior", disabled: acidBlock },
    { text: "见城堡国王", action: "castle_king" },
    { text: "见城堡皇后", action: "castle_queen" },
    { text: "参加贵族宴会", action: "castle_banquet" },
    { text: "参加贵族舞会", action: "castle_ball" },
    { text: "在贵族客房休息", action: "castle_room" },
  ];
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "平民";
  if (rank >= 2) {
    opts.push({ text: "领取爵位俸禄", action: "castle_salary" });
  }
  opts.push({ text: "进行感染治疗", action: "castle_treatment" });
  opts.push({ text: "爵位补办", action: "castle_reissue" });
  const meetingCooldown = state.lastMeetingDay === state.day ? "（今日已参加）" : "";
  opts.push({ text: `参加城堡会议${meetingCooldown}`, action: "castle_meeting", disabled: state.lastMeetingDay === state.day });
  const gardenCooldown = state.lastGardenDay >= state.day - (GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS - 1) ? `（${GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS - (state.day - state.lastGardenDay)}天后可再来）` : "";
  const gardenDisabled = state.day - state.lastGardenDay < GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS;
  opts.push({ text: `在后花园闲逛${gardenCooldown}`, action: "castle_garden", disabled: gardenDisabled });
  opts.push({ text: "地下区域", action: "castle_underground" });
  opts.push({ text: "王国任务", action: "castle_king_quest" });

  // 老马任务链：刺杀国王
  if (state.oldMaStep >= 4 && !state.kingKilled) {
    const hasId = hasCastleIdentity(state);
    if (!hasId) {
      opts.push({ text: "🔪 刺杀国王", action: "assassinate_king" });
    }
  }

  setOptions(opts);
}

export function handleCastleInteriorExplore() {
  const state = getState();
  const hasId = hasCastleIdentity(state);

  if (!hasId) {
    setStory("你正想搜刮点东西，巡逻的守卫注意到了你！你被赶了出去！");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      state.currentSubMap = null;
      refreshCastleOutpost();
    }
    return;
  }

  if (state.lastCastleExploreDay >= state.day) {
    setStory("今天已经探索过了，明天再来吧。");
    refreshCastleInterior();
    return;
  }
  state.lastCastleExploreDay = state.day;

  const lootTables = [FOODS, DRINKS, FRUITS];
  const pool = lootTables[Math.floor(Math.random() * lootTables.length)];
  const item = pool[Math.floor(Math.random() * pool.length)];
  const added = addItem({ ...item });
  if (added) {
    setStory(`你在城堡的角落发现了一些别人遗落的东西：${getItemDisplayName(item)}。`);
  } else {
    setStory("你在城堡里转了转，但背包已经满了，什么也拿不了。");
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleInteriorAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action === "eat") { handleEatSelect(); return; }
  if (option.action === "drink") { handleDrinkSelect(); return; }
  if (option.action === "medicine") { handleMedicineSelect(); return; }
  if (option.action === "equip") { handleEquipSelect(); return; }
  if (option.action === "discard") { handleDiscardSelect(); return; }
  if (option.action === "castle_interior_explore") { handleCastleInteriorExplore(); return; }
  if (option.action === "leave_castle_interior") {
    if (getState().weather === "酸雨") {
      setStory("外面下着腐蚀性的酸雨，你根本没法出去。还是找个地方待着吧。");
      return;
    }
    handleLeaveCastleInterior(); return;
  }
  if (option.action === "castle_king") { handleCastleKing(); return; }
  if (option.action === "castle_queen") { handleCastleQueen(); return; }
  if (option.action === "queen_late_apology") { handleQueenLateApology(); return; }
  if (option.action === "queen_past") { handleQueenPast(); return; }
  if (option.action === "queen_quest1") { handleQueenQuest1(); return; }
  if (option.action === "queen_quest2") { handleQueenQuest2(); return; }
  if (option.action === "queen_quest3") { handleQueenQuest3(); return; }
  if (option.action === "queen_quest4") { handleQueenQuest4(); return; }
  if (option.action === "queen_royal_trade") { handleRoyalTrade(); return; }
  if (option.action === "queen_royal_exchange") { handleRoyalExchange(); return; }
  if (option.action === "queen_exchange_gouqi") { handleExchangeGouqi(); return; }
  if (option.action === "queen_exchange_sword") { handleExchangeSword(); return; }
  if (option.action === "queen_royal_shop") { handleRoyalShop(); return; }
  if (option.action.startsWith("queen_buy_")) {
    const itemId = option.action.replace("queen_buy_", "");
    handleRoyalShopBuy(itemId);
    return;
  }
  if (option.action === "castle_banquet") { handleCastleBanquet(); return; }
  if (option.action === "castle_ball") { handleCastleBall(); return; }
  if (option.action === "castle_room") { handleCastleRoom(); return; }
  if (option.action === "castle_salary") { handleCastleSalary(); return; }
  if (option.action === "castle_treatment") { handleCastleTreatment(); return; }
  if (option.action === "castle_meeting") { handleCastleMeeting(); return; }
  if (option.action === "castle_garden") { handleCastleGarden(); return; }
  if (option.action === "castle_reissue") { handleCastleTitleReissue(); return; }
  if (option.action === "castle_king_quest") { handleCastleKingQuest(); return; }
  if (option.action === "castle_underground") { handleCastleUnderground(); return; }
  if (option.action === "underground_dismantle") { handleDismantleEquipment(); return; }
  if (option.action === "underground_leave") { refreshCastleInterior(); return; }
  if (option.action === "king_underground") { handleKingUnderground(); return; }
  if (option.action === "king_trade_awm") { handleKingTradeAWM(); return; }
  if (option.action === "castle_back") { refreshCastleInterior(); return; }
  if (option.action === "treat_10") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[0]) {
      const rn = getCastleRankName(getState()) || "平民";
      setStory(`这位${rn}大人，不好意思，医疗资源有限，我们只给每位伯爵以上的大人安排见习医生。`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[0]); return;
  }
  if (option.action === "treat_30") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[1]) {
      const rn = getCastleRankName(getState()) || "平民";
      setStory(`这位${rn}大人，不好意思，医疗资源有限，我们只给每位侯爵以上的大人安排正式医生。`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[1]); return;
  }
  if (option.action === "treat_50") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[2]) {
      const rn = getCastleRankName(getState()) || "平民";
      setStory(`这位${rn}大人，不好意思，医疗资源有限，我们只给每位公爵以上的大人安排主治医生。`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[2]); return;
  }
  if (option.action === "treat_80") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[3]) {
      const rn = getCastleRankName(getState()) || "平民";
      setStory(`这位${rn}大人，不好意思，医疗资源有限，我们只给每位储君以上的大人安排宫廷医生。`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[3]); return;
  }
  if (option.action === "treat_back") { refreshCastleInterior(); return; }
  if (option.action === "king_quest_submit") { handleKingQuestSubmit(); return; }
  if (option.action === "king_quest_back") { refreshCastleInterior(); return; }
  if (option.action === "assassinate_king") { handleAssassinateKing(); return; }
  if (option.action === "assassinate_king_fight") { handleAssassinateKingFight(); return; }
}

export function handleLeaveCastleInterior() {
  const state = getState();
  state.currentSubMap = null;
  setStory("你离开了城堡。");
  showExploreOptionsState();
}

export function handleLeaveCastle() {
  setStory("你离开了末日城堡，回到了野外。");
  handleGoOut();
}

export function handleCastleUnderground() {
  const state = getState();
  if (!state.undergroundKeyObtained) {
    const hasKey = state.other.some(i => i.id === "underground_key");
    if (!hasKey) {
      setStory("厚重的铁门紧锁着，你没有钥匙，无法进入地下区域。");
      refreshCastleInterior();
      return;
    }
  }
  if (state.generatorObtained) {
    setStory(UNDERGROUND_STORY + "\n\n部分核电装置已经被拆除了，剩下的还在安静地运转。再拆的话，城堡恐怕就要停电了。");
    const opts = [
      { text: "返回大厅", action: "castle_back" },
    ];
    setOptions(opts);
    setPhase("castle_interior");
    return;
  }
  setStory(UNDERGROUND_STORY);
  const opts = [
    { text: "拆下设备", action: "underground_dismantle" },
    { text: "离开", action: "underground_leave" },
  ];
  setOptions(opts);
  setPhase("castle_interior");
}

export function handleDismantleEquipment() {
  const state = getState();
  if (state.generatorObtained) {
    setStory("再拆城堡就停电了！");
    refreshCastleInterior();
    return;
  }
  const hasWrench = state.meleeWeapon && state.meleeWeapon.id === GAME_CONSTANTS.ROCKET.DISMANTLE_WEAPON_ID;
  const hasDimBag = state.backpack && state.backpack.id === GAME_CONSTANTS.ROCKET.DISMANTLE_BACKPACK_ID;
  if (!hasWrench && !hasDimBag) {
    setStory("你既没有扳手，也没有合适的背包，什么都做不了。");
    refreshCastleInterior();
    return;
  }
  if (!hasWrench) {
    setStory("你没有扳手，无法卸下这些核电装置的固定螺栓。");
    refreshCastleInterior();
    return;
  }
  if (!hasDimBag) {
    setStory("你没有合适的背包装得下它，看来需要传说中的次元背包了。");
    refreshCastleInterior();
    return;
  }
  const generator = SPECIAL_ITEMS.small_nuclear_generator;
  if (generator) {
    const added = addItem({ ...generator });
    if (added) {
      state.generatorObtained = true;
      setStory("你用大扳手小心翼翼地卸下固定螺栓，将小核能发电机从基座上拆了下来。次元收纳背包的空间刚好能装下这个大家伙。你感到背包微微发热——发电机还在运转。");
    } else {
      setStory("你试图拆下设备，但背包空间不足，无法携带！");
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

// ========== 老马任务：刺杀国王 ==========

export function handleAssassinateKing() {
  const state = getState();
  if (state.kingKilled) {
    setStory("国王已经不在了，王座上空空如也。");
    refreshCastleInterior();
    return;
  }
  if (state.oldMaStep < 4) {
    refreshCastleInterior();
    return;
  }
  const hasId = hasCastleIdentity(state);
  if (hasId) {
    setStory("你身上还带着城堡的身份，守卫们对你虎视眈眈。你无法在这里动手。");
    refreshCastleInterior();
    return;
  }
  setPhase("castle_interior");
  setStory("你装作若无其事地靠近王座。国王正倚靠在镶金的扶手上打盹，华丽的王袍上绣着末世前就已绝迹的珍禽异兽。\n\n大厅里的贵族们还在远处觥筹交错，没有人注意到你。你的手摸向腰间的武器——这是最好的时机。\n\n动手吗？");
  setOptions([
    { text: "动手！", action: "assassinate_king_fight" },
    { text: "再等等……", action: "castle_back" },
  ]);
}

export function handleAssassinateKingFight() {
  const state = getState();
  const king = NAMED_NPCS.king_boss;
  state._pendingNpc = {
    name: king.name,
    hp: king.hp,
    damage: king.damage,
    hasRanged: king.hasRanged,
    dodgeRate: king.dodgeRate,
  };
  state._pendingNpcCallback = "assassinate_king_result";
  setPhase("pre_combat_npc");
  const meleeName = state.meleeWeapon.name;
  const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "无";
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ 你的身体极度疲惫，无法正常战斗！建议先休息。" : "";
  setStory(`你拔出武器，冲向王座！国王猛然惊醒，眼中闪过一丝惊恐，随即化作了冷酷的怒火。他拔出腰间的长剑，国王近卫也从暗处冲了出来——但你的目标只有国王一人！\n\n⚔️ ${king.name}\n❤️ HP:${king.hp} | ⚡ 伤害:${king.damage}\n\n【近战】${meleeName}\n【远程】${rangedName}${crashWarning}`);
  const opts = [
    { text: "近战作战", action: "combat_npc_melee" }
  ];
  if (state.rangedWeapon && state.ammo.some(a => a.id === state.rangedWeapon.ammoType && a.count > 0)) {
    opts.push({ text: "远程作战", action: "combat_npc_ranged" });
  } else {
    opts.push({ text: "远程作战（不可用：无弹药）", action: "combat_npc_ranged", disabled: true });
  }
  opts.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
  setOptions(opts);
}
