import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  NERVOUS_VETERAN_DIALOGUES,
  AMMO,
  GAME_CONSTANTS,
  MAP_NPC_INTROS,
  NAMED_NPCS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleVeteranInteract() {
  const state = getState();
  setPhase("explore");
  const opts = [
    { text: "对话", action: "veteran_chat" },
    { text: "讨要子弹", action: "veteran_ammo" },
    { text: "离开", action: "veteran_leave" },
  ];
  // 老马任务链：灭了老赵
  if (state.oldMaStep >= 5 && !state.zhaoKilled) {
    opts.splice(2, 0, { text: "🔪 灭了老赵", action: "kill_zhao" });
  }
  if (state.zhaoKilled) {
    setStory("老赵的尸体还倒在地上，军事检查站空无一人。");
    showExploreOptionsState();
    return;
  }
  setStory(MAP_NPC_INTROS.veteran_intro);
  setOptions(opts);
}

export function handleVeteranChat() {
  setPhase("explore");
  const state = getState();
  const line = NERVOUS_VETERAN_DIALOGUES[Math.floor(Math.random() * NERVOUS_VETERAN_DIALOGUES.length)];
  let result = line;
  advanceTime(1);
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE);
    result += `\n\n老兵突然狂躁起来，手中的步枪走火了！你被击中，生命值 -${GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE}。`;
  }
  setStory(result);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setOptions([
      { text: "对话", action: "veteran_chat" },
      { text: "讨要子弹", action: "veteran_ammo" },
      { text: "离开", action: "veteran_leave" },
    ]);
  }
}

export function handleVeteranLeave() {
  setStory("你离开了军事检查站。");
  showExploreOptionsState();
}

export function handleVeteranAmmo() {
  const state = getState();
  if (state.lastVeteranAmmoDay >= state.day) {
    setStory("今天已经向老赵讨要过子弹了，明天再来吧。");
    handleVeteranInteract();
    return;
  }
  advanceTime(1);
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_GIVE_RATE) {
    const ammo = AMMO[Math.floor(Math.random() * AMMO.length)];
    const count = Math.floor(Math.random() * (GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_MAX - GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_MIN + 1)) + GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_MIN;
    const added = addItem({ id: ammo.id, name: ammo.name, type: "ammo", count });
    if (added) {
      setStory(`老赵打量了你一番，眼神中露出一丝熟悉。\"小子，拿着！当年我在部队的时候……唉，不说了。\"他丢给你${count}发${ammo.name}。`);
    } else {
      setStory("老赵打量了你一番，正想给你些子弹，但你的背包已经满了。");
    }
  } else {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE);
    setStory(`老赵突然眼神一变，举起枪对准你：\"你是他们派来的奸细！滚！\"他扣动扳机，你被击中，生命值 -${GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE}。`);
  }
  state.lastVeteranAmmoDay = state.day;
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleVeteranInteract();
  }
}

// ========== 老马任务：灭了老赵 ==========

export function handleKillZhao() {
  const state = getState();
  if (state.zhaoKilled) {
    setStory("老赵已经死了，检查站只剩下风穿过铁丝网的呜咽声。");
    showExploreOptionsState();
    return;
  }
  if (state.oldMaStep < 5) {
    handleVeteranInteract();
    return;
  }
  const zhao = NAMED_NPCS.zhao_boss;
  state._pendingNpc = {
    name: zhao.name,
    hp: zhao.hp,
    damage: Math.floor(Math.random() * (zhao.damageMax - zhao.damageMin + 1)) + zhao.damageMin,
    hasRanged: zhao.hasRanged,
    dodgeRate: zhao.dodgeRate,
  };
  state._pendingNpcCallback = "kill_zhao_result";
  setPhase("pre_combat_npc");
  const meleeName = state.meleeWeapon.name;
  const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "无";
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ 你的身体极度疲惫，无法正常战斗！" : "";
  setStory(`你握紧武器，向老赵走去。老赵警觉地转身，步枪瞬间抬起——\"又是你？！站住！别动！\"\n\n他疯狂的眼神告诉你，没有退路了。\n\n⚔️ ${zhao.name}\n❤️ HP:${zhao.hp} | ⚡ 伤害:${zhao.damageMin}-${zhao.damageMax}\n\n【近战】${meleeName}\n【远程】${rangedName}${crashWarning}`);
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
