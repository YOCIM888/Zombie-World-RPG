export const INVEST_AMOUNTS = [100, 200,300,400,500,600,700,800,900,1000];
export const INVEST_DURATION_DAYS = 5;

export const INVEST_DIRECTIONS = [
  // 原有投资
  {
    id: "realestate",
    name: "投资房产（高波动）",
    outcomes: [
      { probability: 0.04, returnRate: 0.80, desc: "岛上地价暴涨！你的房产投资获得了惊人回报！" },
      { probability: 0.10, returnRate: 0.50, desc: "房产市场大幅升温，收益非常可观。" },
      { probability: 0.22, returnRate: 0.15, desc: "房价稳中有升，你获得了一些收益。" },
      { probability: 0.14, returnRate: 0.00, desc: "房产市场不温不火，勉强保本。" },
      { probability: 0.28, returnRate: -0.15, desc: "房产市场小幅降温，投资出现亏损。" },
      { probability: 0.22, returnRate: -0.40, desc: "楼市崩盘！你的资产大幅缩水。" },
    ],
  },
  {
    id: "food",
    name: "投资食品（稳健型）",
    outcomes: [
      { probability: 0.35, returnRate: 0.10, desc: "食品需求稳定，你获得了一些收益。" },
      { probability: 0.35, returnRate: 0.00, desc: "食品市场平稳，你的投资不赚不赔。" },
      { probability: 0.30, returnRate: -0.10, desc: "食品供应过剩，你的投资小幅亏损。" },
    ],
  },
  {
    id: "entertainment",
    name: "投资娱乐（高波动）",
    outcomes: [
      { probability: 0.01, returnRate: 0.90, desc: "娱乐项目一炮而红！你赚得盆满钵满！" },
      { probability: 0.05, returnRate: 0.60, desc: "娱乐项目反响热烈，收益相当不错。" },
      { probability: 0.18, returnRate: 0.20, desc: "项目表现尚可，获得了一些回报。" },
      { probability: 0.21, returnRate: 0.05, desc: "娱乐项目勉强盈利，小赚一笔。" },
      { probability: 0.20, returnRate: -0.10, desc: "人气不足，投资出现小幅亏损。" },
      { probability: 0.30, returnRate: -0.25, desc: "项目彻底过气，你损失惨重。" },
    ],
  },
  {
    id: "tech",
    name: "投资科技（中风险）",
    outcomes: [
      { probability: 0.30, returnRate: 0.20, desc: "科技研发取得进展，你获得了一些收益。" },
      { probability: 0.30, returnRate: 0.00, desc: "科技研发仍在进行，你的投资不赚不赔。" },
      { probability: 0.40, returnRate: -0.15, desc: "科技研发遇到瓶颈，你的投资小幅亏损。" },
    ],
  },
  {
    id: "agriculture",
    name: "投资农业（稳健型）",
    outcomes: [
      { probability: 0.10, returnRate: 0.25, desc: "今年风调雨顺，农作物大丰收！你获得了丰厚回报！" },
      { probability: 0.20, returnRate: 0.08, desc: "农业收成尚可，你获得了一点收益。" },
      { probability: 0.45, returnRate: 0.00, desc: "农业收成平平，你的投资不赚不赔。" },
      { probability: 0.25, returnRate: -0.15, desc: "遭遇虫害，农作物减产，你的投资小幅亏损。" },
    ],
  },

  // 新增投资
  {
    id: "mining",
    name: "投资矿业（高波动）",
    outcomes: [
      { probability: 0.05, returnRate: 1.00, desc: "发现大型矿脉！投资直接翻倍！" },
      { probability: 0.10, returnRate: 0.50, desc: "矿产价格走高，收益十分可观。" },
      { probability: 0.20, returnRate: 0.10, desc: "矿业产出稳定，小有盈利。" },
      { probability: 0.25, returnRate: 0.00, desc: "矿产市场平淡，刚好回本。" },
      { probability: 0.25, returnRate: -0.20, desc: "矿场发生小规模事故，造成一定损失。" },
      { probability: 0.15, returnRate: -0.50, desc: "矿难频发，投资大幅缩水。" },
    ],
  },
  {
    id: "pharma",
    name: "投资医药（低风险）",
    outcomes: [
      { probability: 0.15, returnRate: 0.15, desc: "新药顺利上市，获利不少。" },
      { probability: 0.50, returnRate: 0.04, desc: "常规药品销售稳定，收益平稳。" },
      { probability: 0.35, returnRate: -0.12, desc: "研发管线受挫，轻微亏损。" },
    ],
  },
  {
    id: "energy",
    name: "投资能源（稳健型）",
    outcomes: [
      { probability: 0.10, returnRate: 0.20, desc: "能源价格上涨，回报丰厚。" },
      { probability: 0.28, returnRate: 0.08, desc: "能源需求稳定，获得稳定收益。" },
      { probability: 0.30, returnRate: 0.00, desc: "能源市场风平浪静，不赚不赔。" },
      { probability: 0.32, returnRate: -0.12, desc: "能源价格回落，小幅亏损。" },
    ],
  },
  {
    id: "education",
    name: "投资教育（高波动）",
    outcomes: [
      { probability: 0.03, returnRate: 0.80, desc: "贵族教育一夜爆红！获利丰厚！" },
      { probability: 0.12, returnRate: 0.40, desc: "新课程广受好评，收益可观。" },
      { probability: 0.18, returnRate: 0.10, desc: "招生人数达标，略有盈利。" },
      { probability: 0.12, returnRate: 0.05, desc: "生源稳定，小有结余。" },
      { probability: 0.20, returnRate: 0.00, desc: "教育市场稳定，不赚不赔。" },
      { probability: 0.20, returnRate: -0.15, desc: "竞争激烈，生源流失，出现亏损。" },
      { probability: 0.15, returnRate: -0.40, desc: "王国政策突变，投资项目遭受重创。" },
    ],
  },
  {
    id: "transport",
    name: "投资运输（高波动）",
    outcomes: [
      { probability: 0.05, returnRate: 0.80, desc: "新航线开通，运输订单爆满！" },
      { probability: 0.12, returnRate: 0.30, desc: "物流需求旺盛，收益稳步增长。" },
      { probability: 0.24, returnRate: 0.10, desc: "运输量平稳，略有盈利。" },
      { probability: 0.20, returnRate: 0.00, desc: "市场平淡，刚好回本。" },
      { probability: 0.20, returnRate: -0.15, desc: "燃油成本飙升，利润被严重压缩。" },
      { probability: 0.19, returnRate: -0.40, desc: "重大交通事故导致巨额赔偿。" },
    ],
  },
];