import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  AMMO,
  GAME_CONSTANTS,
  SPECIAL_ITEMS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handlePoliceRaid() {
  const state = getState();
  if (state.lastPoliceRaidDay >= state.day) {
    setStory("今天已经搜查过证物室了，明天再来吧。");
    showExploreOptionsState();
    return;
  }
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.POLICE_TRAP_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.POLICE_TRAP_DAMAGE);
    setStory(`你小心翼翼地翻找证物室，却不慎触发了警局遗留的陷阱！一阵爆炸将你掀翻在地，你被炸伤了，生命值 -${GAME_CONSTANTS.MAP_EVENTS.POLICE_TRAP_DAMAGE}。`);
  } else {
    const ammo = AMMO[Math.floor(Math.random() * AMMO.length)];
    const count = Math.floor(Math.random() * (GAME_CONSTANTS.MAP_EVENTS.POLICE_AMMO_MAX - GAME_CONSTANTS.MAP_EVENTS.POLICE_AMMO_MIN + 1)) + GAME_CONSTANTS.MAP_EVENTS.POLICE_AMMO_MIN;
    const added = addItem({ id: ammo.id, name: ammo.name, type: "ammo", count });
    if (added) {
      setStory(`你在一堆陈旧的档案后面发现了一些遗留弹药：${ammo.name}×${count}。这趟冒险总算没白来。`);
    } else {
      setStory(`你发现了一些弹药：${ammo.name}×${count}，但背包已满，无法携带。`);
    }
  }
  state.lastPoliceRaidDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handlePoliceArchive() {
  const state = getState();
  if (state.lastPoliceArchiveDay >= state.day) {
    setStory("今天已经翻找过档案柜了，明天再来吧。");
    showExploreOptionsState();
    return;
  }
  state.lastPoliceArchiveDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.POLICE_ARCHIVE_CRIME_DATA_RATE) {
    const crimeDoc = SPECIAL_ITEMS.crime_data;
    const added = addItem({ ...crimeDoc });
    if (added) {
      state.crimeDataCount = (state.crimeDataCount || 0) + 1;
      const target = state.oldMaStep >= 1 ? 10 : "?";
      setStory(`你在积满灰尘的档案柜深处翻出了一份泛黄的卷宗。\n\n这是一宗尘封已久的悬案——死者身份不明，案件编号已被涂黑，调查记录中反复出现一个名字：\"老马\"。\n\n📁 获得【犯罪资料】（${state.crimeDataCount}/${target}）`);
    } else {
      setStory("你翻到了一卷标着\"绝密\"字样的档案袋，但背包已满，无法携带。");
    }
  } else {
    const failMessages = [
      "你翻开一个又一个档案柜，里面除了发霉的拘留通知单之外什么都没有。",
      "档案柜里的文件早已被老鼠啃得面目全非，散发着一股霉臭味。",
      "你在档案柜里找到了一本破旧的执勤日记，但翻遍了也没发现任何有价值的线索。",
      "档案柜的锁已经锈死，你费了半天劲才撬开，结果里面空空如也。",
    ];
    setStory(failMessages[Math.floor(Math.random() * failMessages.length)]);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
