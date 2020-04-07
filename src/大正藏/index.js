if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1];
  console.log('\n'.repeat(height))
}
let path = require('path')
let cheerio = require('cheerio')
let util = require('../util/index.js')
let _ = require('lodash')
let iconv = require('iconv-lite')

let dictList = [
  {name: '阿含部', maxJingNum: '0151'},// dictId
  {name: '本缘部', maxJingNum: '0219'},
  {name: '般若部', maxJingNum: '0261'},
  {name: '法华部', maxJingNum: '0277'},
  {name: '华严部', maxJingNum: '0309'},
  {name: '涅槃部', maxJingNum: '0396'},
  {name: '大集部', maxJingNum: '0424'},
  {name: '经集部', maxJingNum: '0847'},
  {name: '密教部', maxJingNum: '1420'},
  {name: '律部', maxJingNum: '1504'},
  {name: '释经论部', maxJingNum: '1535'},
  {name: '毗昙部', maxJingNum: '1563'},
  {name: '中观部', maxJingNum: '1578'},
  {name: '瑜伽部', maxJingNum: '1627'},
  {name: '论集部', maxJingNum: '1692'},
  {name: '经疏部', maxJingNum: '1803'},
  {name: '论疏部', maxJingNum: '1850'},
  {name: '诸宗部', maxJingNum: '2025'},
  {name: '史传部', maxJingNum: '2120'},
  {name: '事汇部', maxJingNum: '2136'},
  {name: '外教部', maxJingNum: '2144'},
  {name: '目录部', maxJingNum: '2184'},
  {name: '古逸部', maxJingNum: '2864'},
  {name: '疑似部', maxJingNum: '2920'},
]
_.each(dictList, (n, i) => {
  n.dictId = 'dzz' + i
  n.dictType = 'dzz'
})
/*
* 获取目录
* */
let getFullText = async (n, i) => {
  let pageText = await util.urlResponse('http://www.dazhengzang.com/dazhengzang/', {charset: 'utf-8'})
  let $ = cheerio.load(pageText)

  let directory = [];
  $('table').eq(0).find('tr').slice(1).each((i, n) => {
    let tdList = $(n).find('td')
    let value = $(tdList[0]).text()

    let dictName = ''
    let dictId = ''
    let dictType = ''
    _.each(dictList, (n, i) => {
      if (value <= n.maxJingNum) {
        dictName = n.name
        dictId = n.dictId
        dictType = n.dictType
        return false
      }
    })

    directory.push({
      dictName,
      dictId,
      dictType,
      keyword: $(tdList[3]).text(),// 经名
      value,// 经号
      author: $(tdList[4]).text().replace(/[〖〗]/gi, ''),// 作者
      juanhao: $(tdList[1]).text(),// 卷号
      yema: $(tdList[2]).text(),// 页码
    })
  })
  // console.log(`directory`, directory);
  let time = new Date().getTime()
  util.writeArrayToJsonFile(`./${time}.大正藏.目录.经.json`, directory)
  util.writeArrayToJsonFile(`./${time}.大正藏.目录.部.json`, dictList)
};

getFullText()


