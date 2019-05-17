if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1];
  console.log('\n'.repeat(height))
}

let path = require('path')
let cheerio = require('cheerio')
let superagent = require('superagent')
let util = require('../util/index.js')
let _ = require('lodash')
let iconv = require('iconv-lite')
let charset = require("superagent-charset");


charset(superagent); //设置字符

/**
 * 根据response.text获取文本信息
 * @param resText
 */
let getContentInText = (resText) => {
  let $ = cheerio.load(resText)
  return $('.STYLE4').text()
}

/*
* 根据URL获取text
* */
let getUrlResText = (url) => {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .charset('gbk')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36')
      .then((res) => {
        resolve(res.text)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

/*
* 获取主要信息
* */
let getMainInfo = async (n) => {
  // 获取主页
  let hostResText = await getUrlResText('https://www.jingangjing.net')
  let $ = cheerio.load(hostResText)

  // 获取顶部导航的链接
  let navList = []
  $(`[id='common']`).eq(0).find('table').eq(1).find('td a').each(function (i, ele) {
    navList.push({title: $(ele).text(), navHref: $(ele).attr('href')})
  })
  console.log(`navList`, navList)

  // 获取顶部导航的链接(全文译文|讲解)(两个模块的数据已相同的:32)
  let translationDomList = $(`[id='common']`).eq(1).find('table').find('td a')
  let explainDomList = $(`[id='common']`).eq(2).find('table').find('td a')
  let translationAndExplainInfoList = Array(translationDomList.length).fill('').map((n, i) => {
    return {
      title: $(translationDomList[i]).text(),
      translationHref: 'https://www.jingangjing.net/' + $(translationDomList[i]).attr('href'),
      explainHref: 'https://www.jingangjing.net/' + $(explainDomList[i]).attr('href'),
    }
  })
  let translationAndExplainResList = await util.asyncMap(translationAndExplainInfoList.slice(0, 2), async (n) => {
    return {
      title: n.title,
      translationText: getContentInText(await getUrlResText(n.translationHref)),
      explainText: getContentInText(await getUrlResText(n.explainHref))
    }
  })
  console.log(` translationAndExplainResList`, translationAndExplainResList);
}

/**
 * 获取注音
 */
let getPy = async () => {
  let hostResText = await getUrlResText('https://www.jingangjing.net/zhuyin.htm')
  let $ = cheerio.load(hostResText)


  // 获取标题
  let titleList = $('.STYLE4 strong').map((i, n) => {
    return $(n).text().replace(/^\s+|\s+$/gi, '')
  }).get()


  // 获取所有信息
  let infoList = _.filter($('.STYLE4').text().split('\n'), (n) => {
    return !(/^\s+$/.test(n) || (n.length === 0))
  }).map((n) => {
    return n.replace(/^\s+|\s+$/gi, '')
  })


  // 根据标题拆分所有信息(分组)
  let splitIndex = [0]
  _.each(infoList, (n, i) => {
    if (_.includes(titleList, n)) {
      splitIndex.push(i - 1)
    }
  })
  splitIndex.push(_.size(infoList))
  splitIndex = _.uniq(splitIndex)

  // 分组后的信息结构 [['fǎ huì yīn yóu fēn dì yī','法会因由分第一','rú shì wǒ wén','如是我闻'],[],[]]
  let splitInfo = []
  splitIndex.reduce((a, b) => {
    splitInfo.push(infoList.slice(a, b))
    return b
  })
  // {title:'',titlePy:'',contentList:[{content:'',contentPy:''}]}
  console.log(`getPy splitIndex`, splitInfo);
}

getPy()
