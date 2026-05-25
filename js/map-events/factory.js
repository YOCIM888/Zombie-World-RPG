import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  GAME_CONSTANTS,
  FOODS,
  CANNED_FOOD_IDS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleExploreFactory() {
  const state = getState();
  if (state.lastFactoryExploreDay >= state.day) {
    setStory("今天已经探索过工厂内部了，明天再来吧。");
    showExploreOptionsState();
    return;
  }
  state.lastFactoryExploreDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.FACTORY_EXPLOSION_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.FACTORY_EXPLOSION_DAMAGE);
    setStory(`你意外碰到了爆炸物被炸伤了，扣${GAME_CONSTANTS.MAP_EVENTS.FACTORY_EXPLOSION_DAMAGE}健康。`);
  } else {
    const canned = FOODS.filter(f => CANNED_FOOD_IDS.includes(f.id));
    const can = canned[Math.floor(Math.random() * canned.length)];
    const added = addItem({ ...can });
    if (!added) {
      setStory(`你在工厂内部找到了${can.name}，但背包已满，无法携带。`);
    } else {
      setStory(`你在工厂内部找到了${can.name}！`);
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    const maps = state.stats?.mapsExplored || [];
    if (!state.unlockedAchievements) state.unlockedAchievements = [];
    for (const entry of GAME_CONSTANTS.ACHIEVEMENTS.EXPLORATION_MAPS) {
      if (maps.length >= entry.threshold && !state.unlockedAchievements.includes(entry.id)) state.unlockedAchievements.push(entry.id);
    }
    showExploreOptionsState();
  }
}

export function handleFactoryWorkshop() {
  const state = getState();
  if (state.lastFactoryWorkshopDay >= state.day) {
    setStory("今天已经查看过车间了，明天再来吧。");
    showExploreOptionsState();
    return;
  }
  state.lastFactoryWorkshopDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.FACTORY_WORKSHOP_SCARY_RATE) {
    state.sanity = Math.max(0, state.sanity - GAME_CONSTANTS.MAP_EVENTS.FACTORY_WORKSHOP_SANITY_LOSS);
    const scaryStories = [
      "一台锈迹斑斑的大型冲压机突然自行启动，发出刺耳的金属撞击声——但电源线早已被剪断。你连滚带爬地退出了车间，心脏狂跳不止。",
      "阴暗角落的传送带上赫然躺着一具早已干枯的尸体，他的手指还保持着指向某个方向的姿势。你顺着方向望去，墙上用血写着一行字：\"他们还在看着我\"。",
      "你听到车间深处传来微弱的婴儿哭声。循声走去，发现一台老旧收音机搁在满地碎玻璃中，正在播放一段循环录音。收音机旁散落着几颗儿童牙齿。",
      "车间天花板的通风管道里，有什么东西在爬行。你抬起头，数十双发着绿光的眼睛正从铁栅栏的缝隙中冷冷地注视着你。那些不是老鼠。",
      "一具穿着工装的骸骨端坐在操作台前，仿佛还在加班。他面前的电脑屏幕竟然还亮着，上面反复闪烁着一行字：\"下班时间已过，请尽快离开\"。",
    ];
    setStory(scaryStories[Math.floor(Math.random() * scaryStories.length)] + `\n\n你的理智 -${GAME_CONSTANTS.MAP_EVENTS.FACTORY_WORKSHOP_SANITY_LOSS}`);
  } else {
    const food = FOODS[Math.floor(Math.random() * FOODS.length)];
    const added = addItem({ ...food });
    if (added) {
      setStory(`你在车间的员工储物柜里翻到了一个未开封的包裹——${food.name}！看来以前有人把它偷偷藏在了柜子最深处。`);
    } else {
      setStory(`你在车间的员工储物柜里发现了${food.name}，但背包已满，无法携带。`);
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
