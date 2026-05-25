import {
  getState,
  setPhase,
  setStory,
  setOptions,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  resetCrashTurns,
} from '../state.js';

import {
  MAP_NPC_INTROS,
  NAMED_NPCS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleMaskedManInteract() {
  const state = getState();
  if (state.shadowDefeated) {
    setStory("那个黑影已经不在了，超市角落空荡荡的。");
    showExploreOptionsState();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.shadow_intro);
  setOptions([
    { text: "对抗", action: "masked_man_fight" },
    { text: "离开", action: "masked_man_leave" },
  ]);
}

export function handleMaskedManFight() {
  const state = getState();
  const shadow = NAMED_NPCS.shadow;
  state._pendingNpc = {
    name: shadow.name,
    hp: shadow.hp,
    damage: Math.floor(Math.random() * (shadow.damageMax - shadow.damageMin + 1)) + shadow.damageMin,
    hasRanged: shadow.hasRanged,
    dodgeRate: shadow.dodgeRate,
  };
  setPhase("pre_combat_npc");
  setStory(MAP_NPC_INTROS.shadow_fight);
  setOptions([
    { text: "近战作战", action: "combat_npc_melee" },
    { text: "远程射击", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}

export function handleMaskedManLeave() {
  setStory(MAP_NPC_INTROS.shadow_leave);
  showExploreOptionsState();
}

export function handleSupermarketContraband() {
  const state = getState();
  if (state.oldMaContrabandUsed) {
    setStory("你再次打开那个隐蔽的暗格，里面空空如也。那股诡异的能量已经消散了，什么也没有留下。");
    showExploreOptionsState();
    return;
  }
  setStory("你在超市最深处的一排货架后面，发现了一个极其隐蔽的暗格。里面有某种散发着幽绿色光芒的管状物——不像是这个世界的东西。\n\n你犹豫了片刻，最终还是按下了启动钮。一股冰冷的能量瞬间涌入体内，你的视野边缘开始扭曲，脑海中闪过无数支离破碎的画面——血月、倒悬的城市、无数无声尖叫的面孔……\n\n不知过了多久，你才从地上爬起来。身体从未如此有力，但心里却像被剜去了一块什么东西。");
  state.sanity = Math.max(0, state.sanity - 50);
  state.crash = 0;
  resetCrashTurns();
  state.oldMaContrabandUsed = true;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
