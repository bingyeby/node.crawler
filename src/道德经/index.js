if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1];
  console.log('\n'.repeat(height))
}
let path = require('path')
let cheerio = require('cheerio')
let util = require('../util/index.js')
let _ = require('lodash')
let iconv = require('iconv-lite')

const siteOrigin = 'https://www.daodejing.org/'


/**
 * 根据response.text获取文本信息
 * @param resText
 */
let explainInfoGet = (resText) => {
  let $ = cheerio.load(resText)
  let info = {yuanwen: '', yiwen: '', zhushi: '', yanshen1: '', yanshen2: ''}
  let label = 'other'
  $('.STYLE4').each((index, n) => {
    let text = $(n).text()
    if (/\[原文\]/.test(text)) {
      label = 'yuanwen'
      return
    }
    if (/\[译文\]/.test(text)) {
      label = 'yiwen'
      return
    }
    if (/\[注释\]/.test(text)) {
      label = 'zhushi'
      return
    }
    if (/\[延伸阅读1\]/.test(text)) {
      label = 'yanshen1'
      return
    }
    if (/\[延伸阅读2\]/.test(text)) {
      label = 'yanshen2'
      return
    }
    info[label] = info[label] + ((info[label] && !/^\s*$/.test(text)) ? '\n' : '') + text
  })
  return info
}

/*
* 获取道德经的原文 译文 注解
* */
let getMainInfo = async (n) => {
  // 获取主页
  let hostResText = await util.urlResponse(siteOrigin)
  let $ = cheerio.load(hostResText)

  // 获取顶部导航的链接
  // let navList = []
  // $(`[id='common']`).eq(0).find('table').eq(1).find('td a').each(function (i, ele) {
  //   navList.push({title: $(ele).text(), navHref: $(ele).attr('href')})
  // })
  // console.log(`navList`, navList)

  // 获取顶部导航的链接
  let explainDomList = $(`[id='common']`).eq(1).find('table').find('td a');
  let translationAndExplainInfoList = Array(explainDomList.length).fill('').map((n, i) => {
    return {
      title: $(explainDomList[i]).text(),
      explainHref: siteOrigin + $(explainDomList[i]).attr('href'),
    }
  });
  // console.log(`translationAndExplainInfoList`, translationAndExplainInfoList);
  let translationAndExplainResList = await util.asyncMap(translationAndExplainInfoList.slice(0, 100), async (n) => {
    try {
      await util.delay(1000) // 稍微等3s
      console.log(`n.title`, n.title);
      return {
        title: n.title,
        ...explainInfoGet(await util.urlResponse(n.explainHref))
      }
    } catch (e) {
      console.log(`e`, e);
      return {
        title: n.title,
      }
    }

  });
  // console.log(`translationAndExplainResList`, translationAndExplainResList);
  util.writeArrayToJsonFile(`./道德经.${new Date().getTime()}.json`, translationAndExplainResList)
}

/*
* 获取道德经原文
* */
let getFullText = async (n, i) => {
  let pageText = await util.urlResponse(siteOrigin)
  let $ = cheerio.load(pageText)

  let fullText = [];
  let index = 0
  fullText[0] = {
    text: ''
  }

  $('.STYLE10').each((i, n) => {
    let text = $(n).text().replace(/〖译文〗/, '');
    if (/^\s*$/.test(text)) {
      index++
      fullText[index] = {
        text: ''
      }
    }
    fullText[index].text += text
  })
  console.log(`fullText`, fullText);
  util.writeArrayToJsonFile(`./道德经.全文.${new Date().getTime()}.json`, fullText)

};

// getMainInfo()
// getFullText()
