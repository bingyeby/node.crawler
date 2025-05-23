/** * 测试数据 * @type {arry} */
/*2021-11-05 22:04:25*/
var ishb = false;
/*基金或股票信息*/
var fS_name = "华夏中证动漫游戏ETF联接C";
var fS_code = "012769";
/*原费率*/
var fund_sourceRate = "0.00";
/*现费率*/
var fund_Rate = "0.00";
/*最小申购金额*/
var fund_minsg = "10";
/*基金持仓股票代码*/
var stockCodes = [];
/*基金持仓债券代码*/
var zqCodes = "";
/*基金持仓股票代码(新市场号)*/
var stockCodesNew = [];
/*基金持仓债券代码（新市场号）*/
var zqCodesNew = "";
/*收益率*/
/*近一年收益率*/
var syl_1n = "";
/*近6月收益率*/
var syl_6y = "";
/*近三月收益率*/
var syl_3y = "";
/*近一月收益率*/
var syl_1y = "11.62";
/*股票仓位测算图*/
var Data_fundSharesPositions = [[1633622400000, 0.0], [1633881600000, 0.0], [1633968000000, 0.0], [1634054400000, 0.0], [1634140800000, 0.0], [1634227200000, 0.0], [1634486400000, 0.0], [1634572800000, 0.0], [1634659200000, 0.0], [1634745600000, 0.0], [1634832000000, 0.0], [1635091200000, 0.0], [1635177600000, 0.0], [1635264000000, 0.0], [1635350400000, 0.0], [1635436800000, 0.0], [1635696000000, 0.0], [1635782400000, 0.0], [1635868800000, 0.0], [1635955200000, 0.0]];
/*单位净值走势 equityReturn-净值回报 unitMoney-每份派送金*/
var Data_netWorthTrend = [{
  "x": 1630339200000,
  "y": 1.0,
  "equityReturn": 0,
  "unitMoney": ""
}, {
  "x": 1630598400000,
  "y": 1.0003,
  "equityReturn": 0,
  "unitMoney": ""
}, {
  "x": 1631203200000,
  "y": 1.0072,
  "equityReturn": 0,
  "unitMoney": ""
}, {
  "x": 1631462400000,
  "y": 1.0197,
  "equityReturn": 1.24,
  "unitMoney": ""
}, {
  "x": 1631548800000,
  "y": 0.9993,
  "equityReturn": -2.0,
  "unitMoney": ""
}, {
  "x": 1631635200000,
  "y": 1.0056,
  "equityReturn": 0.63,
  "unitMoney": ""
}, {
  "x": 1631721600000,
  "y": 1.0016,
  "equityReturn": -0.4,
  "unitMoney": ""
}, {
  "x": 1631808000000,
  "y": 0.9843,
  "equityReturn": -1.73,
  "unitMoney": ""
}, {
  "x": 1632240000000,
  "y": 0.9706,
  "equityReturn": -1.39,
  "unitMoney": ""
}, {
  "x": 1632326400000,
  "y": 0.9861,
  "equityReturn": 1.6,
  "unitMoney": ""
}, {
  "x": 1632412800000,
  "y": 0.9853,
  "equityReturn": -0.08,
  "unitMoney": ""
}, {
  "x": 1632672000000,
  "y": 0.969,
  "equityReturn": -1.65,
  "unitMoney": ""
}, {
  "x": 1632758400000,
  "y": 0.9597,
  "equityReturn": -0.96,
  "unitMoney": ""
}, {
  "x": 1632844800000,
  "y": 0.9368,
  "equityReturn": -2.39,
  "unitMoney": ""
}, {
  "x": 1632931200000,
  "y": 0.9607,
  "equityReturn": 2.55,
  "unitMoney": ""
}, {
  "x": 1633622400000,
  "y": 0.9781,
  "equityReturn": 1.81,
  "unitMoney": ""
}, {
  "x": 1633881600000,
  "y": 1.0006,
  "equityReturn": 2.3,
  "unitMoney": ""
}, {
  "x": 1633968000000,
  "y": 0.9784,
  "equityReturn": -2.22,
  "unitMoney": ""
}, {
  "x": 1634054400000,
  "y": 0.9849,
  "equityReturn": 0.66,
  "unitMoney": ""
}, {
  "x": 1634140800000,
  "y": 0.977,
  "equityReturn": -0.8,
  "unitMoney": ""
}, {
  "x": 1634227200000,
  "y": 0.9762,
  "equityReturn": -0.08,
  "unitMoney": ""
}, {
  "x": 1634486400000,
  "y": 0.9614,
  "equityReturn": -1.52,
  "unitMoney": ""
}, {
  "x": 1634572800000,
  "y": 0.9805,
  "equityReturn": 1.99,
  "unitMoney": ""
}, {
  "x": 1634659200000,
  "y": 0.9778,
  "equityReturn": -0.28,
  "unitMoney": ""
}, {
  "x": 1634745600000,
  "y": 0.9718,
  "equityReturn": -0.61,
  "unitMoney": ""
}, {
  "x": 1634832000000,
  "y": 0.9847,
  "equityReturn": 1.33,
  "unitMoney": ""
}, {
  "x": 1635091200000,
  "y": 0.9809,
  "equityReturn": -0.39,
  "unitMoney": ""
}, {
  "x": 1635177600000,
  "y": 0.9762,
  "equityReturn": -0.48,
  "unitMoney": ""
}, {
  "x": 1635264000000,
  "y": 0.9746,
  "equityReturn": -0.16,
  "unitMoney": ""
}, {
  "x": 1635350400000,
  "y": 0.9645,
  "equityReturn": -1.04,
  "unitMoney": ""
}, {
  "x": 1635436800000,
  "y": 1.006,
  "equityReturn": 4.3,
  "unitMoney": ""
}, {
  "x": 1635696000000,
  "y": 1.0314,
  "equityReturn": 2.52,
  "unitMoney": ""
}, {
  "x": 1635782400000,
  "y": 1.0135,
  "equityReturn": -1.74,
  "unitMoney": ""
}, {
  "x": 1635868800000,
  "y": 1.0266,
  "equityReturn": 1.29,
  "unitMoney": ""
}, {
  "x": 1635955200000,
  "y": 1.0464,
  "equityReturn": 1.93,
  "unitMoney": ""
}, {
  "x": 1636041600000,
  "y": 1.0723,
  "equityReturn": 2.48,
  "unitMoney": ""
}];
/*累计净值走势*/
var Data_ACWorthTrend = [[1630339200000, 1.0], [1630598400000, 1.0003], [1631203200000, 1.0072], [1631462400000, 1.0197], [1631548800000, 0.9993], [1631635200000, 1.0056], [1631721600000, 1.0016], [1631808000000, 0.9843], [1632240000000, 0.9706], [1632326400000, 0.9861], [1632412800000, 0.9853], [1632672000000, 0.969], [1632758400000, 0.9597], [1632844800000, 0.9368], [1632931200000, 0.9607], [1633622400000, 0.9781], [1633881600000, 1.0006], [1633968000000, 0.9784], [1634054400000, 0.9849], [1634140800000, 0.977], [1634227200000, 0.9762], [1634486400000, 0.9614], [1634572800000, 0.9805], [1634659200000, 0.9778], [1634745600000, 0.9718], [1634832000000, 0.9847], [1635091200000, 0.9809], [1635177600000, 0.9762], [1635264000000, 0.9746], [1635350400000, 0.9645], [1635436800000, 1.006], [1635696000000, 1.0314], [1635782400000, 1.0135], [1635868800000, 1.0266], [1635955200000, 1.0464], [1636041600000, 1.0723]];
/*累计收益率走势*/
var Data_grandTotal = [{
  "name": "华夏中证动漫游戏ETF",
  "data": [[1630339200000, 0], [1630598400000, 0.03], [1631203200000, 0.72], [1631462400000, 1.97], [1631548800000, -0.07], [1631635200000, 0.56], [1631721600000, 0.16], [1631808000000, -1.57], [1632240000000, -2.94], [1632326400000, -1.39], [1632412800000, -1.47], [1632672000000, -3.10], [1632758400000, -4.03], [1632844800000, -6.32], [1632931200000, -3.93], [1633622400000, -2.19], [1633881600000, 0.06], [1633968000000, -2.16], [1634054400000, -1.51], [1634140800000, -2.30], [1634227200000, -2.38], [1634486400000, -3.86], [1634572800000, -1.95], [1634659200000, -2.22], [1634745600000, -2.82], [1634832000000, -1.53], [1635091200000, -1.91], [1635177600000, -2.38], [1635264000000, -2.54], [1635350400000, -3.55], [1635436800000, 0.60], [1635696000000, 3.14], [1635782400000, 1.35], [1635868800000, 2.66], [1635955200000, 4.64], [1636041600000, 7.23]]
}, {
  "name": "同类平均",
  "data": [[1630339200000, 0], [1630425600000, 0.25], [1630512000000, 0.46], [1630598400000, -0.13], [1630857600000, 1.69], [1630944000000, 3.01], [1631030400000, 2.80], [1631116800000, 2.93], [1631203200000, 3.51], [1631462400000, 3.24], [1631548800000, 2.38], [1631635200000, 1.83], [1631721600000, 0.22], [1631808000000, 0.86], [1632240000000, 0.63], [1632326400000, 1.21], [1632412800000, 0.74], [1632672000000, 0.14], [1632758400000, 0.27], [1632844800000, -1.30], [1632931200000, -0.12], [1633622400000, 0.25], [1633881600000, 0.12], [1633968000000, -1.32], [1634054400000, -0.27], [1634140800000, -0.35], [1634227200000, 0.30], [1634486400000, 0.03], [1634572800000, 0.90], [1634659200000, 0.68], [1634745600000, 0.70], [1634832000000, 0.76], [1635091200000, 1.50], [1635177600000, 1.21], [1635264000000, 0.21], [1635350400000, -0.75], [1635436800000, 0.35], [1635696000000, 0.30], [1635782400000, -0.58], [1635868800000, -0.62], [1635955200000, 0.23], [1636041600000, -0.49]]
}, {
  "name": "沪深300",
  "data": [[1630339200000, 0], [1630425600000, 1.33], [1630512000000, 1.33], [1630598400000, 0.78], [1630857600000, 2.67], [1630944000000, 3.90], [1631030400000, 3.47], [1631116800000, 3.42], [1631203200000, 4.33], [1631462400000, 3.87], [1631548800000, 2.32], [1631635200000, 1.28], [1631721600000, 0.04], [1631808000000, 1.05], [1632240000000, 0.34], [1632326400000, 0.99], [1632412800000, 0.91], [1632672000000, 1.49], [1632758400000, 1.63], [1632844800000, 0.59], [1632931200000, 1.26], [1633622400000, 2.59], [1633881600000, 2.72], [1633968000000, 1.63], [1634054400000, 2.80], [1634140800000, 2.25], [1634227200000, 2.63], [1634486400000, 1.44], [1634572800000, 2.44], [1634659200000, 2.18], [1634745600000, 2.55], [1634832000000, 3.21], [1635091200000, 3.62], [1635177600000, 3.28], [1635264000000, 1.93], [1635350400000, 1.22], [1635436800000, 2.15], [1635696000000, 1.77], [1635782400000, 0.71], [1635868800000, 0.32], [1635955200000, 1.31], [1636041600000, 0.76]]
}];
/*同类排名走势*/
var Data_rateInSimilarType = [];
/*同类排名百分比*/
var Data_rateInSimilarPersent = [];
/*规模变动 mom-较上期环比*/
var Data_fluctuationScale = {
  "categories": ["2021-08-31"],
  "series": [{
    "y": 0.04,
    "mom": "--"
  }]
};
/*持有人结构*/
var Data_holderStructure = {
  "series": [{
    "name": "机构持有比例",
    "data": []
  }, {
    "name": "个人持有比例",
    "data": []
  }, {
    "name": "内部持有比例",
    "data": []
  }],
  "categories": []
};
/*资产配置*/
var Data_assetAllocation = {
  "series": [{
    "name": "股票占净比",
    "type": null,
    "data": [],
    "yAxis": 0
  }, {
    "name": "债券占净比",
    "type": null,
    "data": [],
    "yAxis": 0
  }, {
    "name": "现金占净比",
    "type": null,
    "data": [],
    "yAxis": 0
  }, {
    "name": "净资产",
    "type": "line",
    "data": [],
    "yAxis": 1
  }],
  "categories": []
};
/*业绩评价 ['选股能力', '收益率', '抗风险', '稳定性','择时能力']*/
var Data_performanceEvaluation = {
  "avr": "暂无数据",
  "categories": ["选证能力", "收益率", "跟踪误差", "超额收益", "管理规模"],
  "dsc": ["反映基金挑选证券而实现风险调整\u003cbr\u003e后获得超额收益的能力", "根据阶段收益评分，反映基金的盈利能力", "根据基金跟踪指数的密切程度评分", "反映基金投资的超额风险所带来的超额收益", "根据基金的资产规模评分"],
  "data": [null, null, null, null, null]
};
/*现任基金经理*/
var Data_currentFundManager = [{
  "id": "30106590",
  "pic": "https://pdf.dfcfw.com/pdf/H8_30106590_1.JPG",
  "name": "徐猛",
  "star": 5,
  "workTime": "8年又213天",
  "fundSize": "975.22亿(27只基金)",
  "power": {
    "avr": "89.91",
    "categories": ["经验值", "收益率", "跟踪误差", "超额收益", "管理规模"],
    "dsc": ["反映基金经理从业年限和管理基金的经验", "根据基金经理投资的阶段收益评分，反映\u003cbr\u003e基金经理投资的盈利能力", "根据基金跟踪指数的密切程度评分，反\u003cbr\u003e应基金经理的管理能力", "根据基金经理投资的超额风险所带来的\u003cbr\u003e超额收益评分", "根据基金经理现任管理基金资产规模评分"],
    "data": [91.60, 70.90, 99.10, 79.10, 99.10],
    "jzrq": "2021-11-05"
  },
  "profit": {
    "categories": ["任期收益", "同类平均", "沪深300"],
    "series": [{
      "data": [{
        "name": null,
        "color": "#7cb5ec",
        "y": 4.64
      }, {
        "name": null,
        "color": "#414c7b",
        "y": -0.2
      }, {
        "name": null,
        "color": "#f7a35c",
        "y": 1.31
      }]
    }],
    "jzrq": "2021-11-05"
  }
}];
/*申购赎回*/
var Data_buySedemption = {
  "series": [{
    "name": "期间申购",
    "data": [0.00]
  }, {
    "name": "期间赎回",
    "data": [0.00]
  }, {
    "name": "总份额",
    "data": [0.04]
  }],
  "categories": ["2021-08-31"]
};
/*同类型基金涨幅榜（页面底部通栏）*/
var swithSameType = [['519158_新华趋势领航混合_17.49', '000166_中海信息产业精选混合_17.42', '011104_光大智能汽车主题股票_15.74', '001576_国泰智能装备股票A_15.58', '011322_国泰智能装备股票C_15.52'], ['010963_信达澳银周期动力混合_30.36', '000729_建信中小盘先锋股票A_22.46', '000433_安信鑫发优选混合A_21.39', '012891_安信鑫发优选混合C_21.27', '010826_大成产业趋势混合A_21.13'], ['005669_前海开源公用事业股票_106.27', '000689_前海开源新经济混合A_106.12', '010135_泰达高研发6个月持有_85.13', '010136_泰达高研发6个月持有_84.87', '000828_泰达转型机遇股票A_82.42'], ['005669_前海开源公用事业股票_145.13', '000689_前海开源新经济混合A_135.79', '000209_信诚新兴产业混合A_133.88', '009644_东方阿尔法优势产业混_120.74', '000828_泰达转型机遇股票A_120.24'], ['000828_泰达转型机遇股票A_504.34', '002190_农银新能源主题_470.68', '000336_农银研究精选混合_439.49', '001606_农银工业4.0混合_430.72', '001704_国投瑞银进宝灵活配置_426.89']];
