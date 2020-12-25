if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1];
  console.log('\n'.repeat(height))
}
let path = require('path')
let cheerio = require('cheerio')
let util = require('../util/index.js')
let _ = require('lodash')
let iconv = require('iconv-lite')
const fss = require("fs-extra");


const locationArr = [
  '全国卷1', '全国卷2', '湖南', '湖北', '广东', '河南',
  '河北', '山东', '山西', '江苏', '浙江', '江西',
  '黑龙江', '云南', '贵州', '福建', '吉林',
  '安徽', '四川', '辽宁', '甘肃', '陕西', '台湾', '青海', '海南',

  '西藏', '宁夏', '广西', '新疆', '内蒙古',
  '北京', '上海', '天津', '重庆'
]


/*
* 获取题目内容
* */
let getArticle = async (articleUrl) => {
  let pageText = await util.urlResponse(articleUrl, {charset: 'gbk'})
  let $ = cheerio.load(pageText)

  let contentWithP = $('.con_content>p').map((i, n) => {
    return $(n).text()
  }).get()

  let contentWithP2 = []
  _.each(contentWithP, (n, i) => {
    if (/题目汇总/.test(n)) {
      return false
    } else {
      contentWithP2.push(n)
    }
  })
  return contentWithP2.join('\n')
}

let parseLocation = (title) => {
  let location = ''
  _.each(locationArr, (n, i) => {
    if (new RegExp(n).test(title)) {
      location = n
    }
  })
  if (/课标Ⅰ/.test(title)) {
    location = '全国卷1'
  }
  if (/课标Ⅱ/.test(title)) {
    location = '全国卷2'
  }
  return location
}

/*
* 获取列表
* */
let getPageList = async (listLink) => {
  let pageText = await util.urlResponse(listLink, {charset: 'gbk'})
  let $ = cheerio.load(pageText)

  let trInfoList = []
  $('.con_content tr').map((i, n) => {
    let tdList = $(n).find('td')
    let tdYear = tdList.eq(0).text().replace(/\s/gi, '')
    if (/^\d{4}$/.test(tdYear)) {
      trInfoList.push({
        topicYear: tdYear,
        topicTitle: tdList.eq(1).text().replace(/\s/gi, ''),
        topicUrl: tdList.eq(2).find('a').attr('href'),
      })
    }
  })
  return trInfoList
}


/*
* 启动
*   1. 获取目录
*   2. 根据目录url获取文章
* */
let main = async (url) => {
  let pageText = await util.urlResponse(url, {charset: 'gbk'})
  let $ = cheerio.load(pageText)

  let listWithLocation = []
  $('.artbox_l').each((i, n) => {
    let LATitle = $(n).find('.artbox_l_t a').text()
    let LALink = $(n).find('.artbox_l_t a').attr('href')
    let location = parseLocation(LATitle)
    listWithLocation.push({LATitle, LALink, location})
  })

  await util.asyncEach(listWithLocation, async (locationInfo) => {
    await util.delay(1000)
    let listWithYear = await getPageList(locationInfo.LALink)
    await util.asyncEach(listWithYear, async (yearInfo) => {
      await util.delay(1000)
      console.log(`++++`, locationInfo.location, yearInfo.topicYear);
      let content = await getArticle(yearInfo.topicUrl)
      await fss.writeFile('./历年高考作文题.json', `${JSON.stringify({
        location: locationInfo.location,
        year: yearInfo.topicYear,
        title: yearInfo.topicTitle,
        url: yearInfo.topicUrl,
        content: content
      })}\n`, {flag: 'a'})
    })
  })
};


fss.removeSync('./历年高考作文题.json')
main('http://www.zuowen.com/gaokaozw/gaokaoti/index.shtml')
// getPageList('http://www.zuowen.com/e/20160513/57358c26d183c.shtml')
// getArticle('http://www.zuowen.com/e/20190612/5d007451a30e9.shtml')

