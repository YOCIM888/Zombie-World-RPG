import {
  getState,
  setPhase,
  setStory,
  setOptions,
  resetState,
} from '../state.js';

import {
  saveGame,
  loadGame,
  deleteSlot,
  getAllSlots
} from '../save.js';

import { showHomeOptions, showExploreOptionsState, returnToMenu } from '../routing.js';

export function handleSavePage() {
  const state = getState();
  const transientPhases = ["pre_combat", "pre_combat_npc", "combat", "survivor_interact", "trader_interact", "trader_buy_ammo", "trader_ammo_qty", "trader_buy_weapon", "doctor_interact", "npc_interact", "npc_gift", "npc_quest", "npc_quest_confirm", "npc_quest_preview", "npc_recycle", "npc_recycle_ranged", "npc_recycle_backpack", "npc_repair", "npc_repair_bow", "npc_cure", "lili_repair_gun", "lili_repair_bow", "leader_assassinate", "leader_assassinate_warn", "leader_gift_select", "nurse_feed", "castle_loan_input", "castle_banker", "castle_banker_waiver", "castle_guard", "castle_bank", "castle_identity", "castle_interior", "castle_treatment", "castle_king_quest", "castle_king_dialog", "map_npc", "map_npc_trade", "map_npc_gift_select", "v_trade", "v_trade_result", "xiaohan_trade", "lili_trade", "island_bank", "island_fishing", "island_yumo", "island_guyue", "island_linhan", "island_bar", "island_black_market", "island_intel", "island_street", "island_street_melee", "island_street_ammo", "island_street_ammo_recycle", "island_street_food", "island_street_medical", "island_invest"];
  if (transientPhases.includes(state.phase)) {
    setStory("当前状态无法存档，请返回安全状态后再保存。");
    return;
  }
  if (state.gameOver && !state._endingBeforeSave) return;
  setPhase("save_page");
  setStory("存档管理 - 选择一个存档槽位进行操作：\n输入对应编号选择槽位，输入 12 返回。");
  renderSaveSlotsAsOptions();
}

export function renderSaveSlotsAsOptions() {
  const slots = getAllSlots();
  const opts = [];
  const autoSlot = slots[0];
  if (autoSlot) {
    opts.push({ text: `🔄 自动存档 | ${autoSlot.nickname} | 第${autoSlot.day}天 | ${autoSlot.timestamp}`, action: "save_slot", index: 0 });
  } else {
    opts.push({ text: `🔄 自动存档 | ——空——`, action: "save_slot", index: 0 });
  }
  for (let i = 1; i < slots.length; i++) {
    const slot = slots[i];
    if (slot) {
      opts.push({ text: `槽位 ${i}. ${slot.nickname} | 第${slot.day}天 | ${slot.timestamp}`, action: "save_slot", index: i });
    } else {
      opts.push({ text: `槽位 ${i}. ——空——`, action: "save_slot", index: i });
    }
  }
  opts.push({ text: "返回", action: "back", index: -1 });
  setOptions(opts);
}

export function handleSavePageAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    returnToMenu();
    return;
  }

  const slotId = option.index;
  state._saveSlotId = slotId;
  state._saveSlotData = loadGame(slotId);

  if (slotId === 0) {
    setPhase("save_confirm");
    if (state._saveSlotData) {
      setStory(`🔄 自动存档：${state._saveSlotData.nickname} | 第${state._saveSlotData.day}天 | ${state._saveSlotData.timestamp}\n（自动存档每5天自动覆盖，不可手动修改）`);
      setOptions([
        { text: "读取存档", action: "load" },
        { text: "返回", action: "back" }
      ]);
    } else {
      setStory(`🔄 自动存档：暂无自动存档`);
      setOptions([
        { text: "返回", action: "back" }
      ]);
    }
    return;
  }

  setPhase("save_confirm");

  if (state._saveSlotData) {
    setStory(`槽位 ${slotId}：${state._saveSlotData.nickname} | 第${state._saveSlotData.day}天 | ${state._saveSlotData.timestamp}\n⚠ 选择"保存覆盖"将永久覆盖此存档！`);
    setOptions([
      { text: "读取存档", action: "load" },
      { text: "保存覆盖", action: "overwrite" },
      { text: "删除存档", action: "delete" },
      { text: "返回", action: "back" }
    ]);
  } else {
    setStory(`槽位 ${slotId}：空`);
    setOptions([
      { text: "保存存档到此", action: "save" },
      { text: "返回", action: "back" }
    ]);
  }
}

export function handleSaveConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;
  const slotId = state._saveSlotId;

  if (action === "back") {
    handleSavePage();
    return;
  }

  if (action === "save" || action === "overwrite") {
    const ok = saveGame(slotId, state, state.name);
    if (ok) {
      if (slotId === 0) {
        setStory(`自动存档已保存。`);
      } else {
        setStory(`存档已保存到槽位 ${slotId}。`);
      }
    } else {
      setStory("保存失败！");
    }
    handleSavePage();
    return;
  }

  if (action === "load") {
    const saveData = loadGame(slotId);
    if (!saveData || !saveData.gameState) {
      setStory("读取存档失败，存档数据损坏！");
      handleSavePage();
      return;
    }
    resetState();
    Object.assign(getState(), saveData.gameState);
    const loadedState = getState();
    setStory(`存档读取成功！欢迎回来，${loadedState.name}。`);
    setPhase("choose");
    if (loadedState.currentMap) {
      showExploreOptionsState();
    } else {
      showHomeOptions();
    }
    return;
  }

  if (action === "delete") {
    const ok = deleteSlot(slotId);
    if (ok) {
      setStory(`槽位 ${slotId} 的存档已删除。`);
    } else {
      setStory("删除失败！");
    }
    handleSavePage();
    return;
  }
}
