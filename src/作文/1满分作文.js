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
  '全国卷1', '全国卷2', '全国卷3', '湖南', '湖北', '广东', '河南', // 新课标II 新课标I 全国卷1 全国卷2 全国卷3
  '河北', '山东', '山西', '江苏', '浙江', '江西',
  '黑龙江', '云南', '贵州', '福建', '吉林',
  '安徽', '四川', '辽宁', '甘肃', '陕西', '台湾', '青海', '海南',

  '西藏', '宁夏', '广西', '新疆', '内蒙古',
  '北京', '上海', '天津', '重庆'
]


/*
* 获取一篇文章
  getArticle('http://www.zuowen.com/e/20071221/4b8bc94e02f3b.shtml')
  getArticle('http://www.zuowen.com/e/20040512/4b8bc948f2b57.shtml')
* */
let getArticle = async (articleUrl) => {
  let pageText = await util.urlResponse(articleUrl, {charset: 'gbk'})
  let $ = cheerio.load(pageText)

  let contentWithP = $('.con_content>p')
  let contentTableList = $('.con_content td.news table')

  let content = ''
  let contentPre = ''
  if (contentWithP.length > 0) {
    content = contentWithP.map((i, n) => {
      return $(n).text()
    }).get().join('\n')
  } else if (contentTableList.length > 0) {
    contentPre = contentTableList.eq(0).text()
    content = contentTableList.eq(1).text()
  }
  return content
}

/*
* 2006高考优秀作文福建地区（4）空白中的独舞_1200字
* 2006高考满分作文江苏地区－－人与路_3000字
* 2006年上海卷高考满分作文：我想握住你的手_3000字
*
* 爱的就是你_1000字
*
* */
let parseTitle = (titleAll) => {
  let year = ''
  let wordCount = ''
  let title = titleAll
  let location = ''


  let _pre = titleAll
  let _end = ''
  if (/_/.test(titleAll)) {
    _pre = titleAll.split(/_/)[0]
    _end = titleAll.split(/_/)[1]
    if (_end) {
      if (/\d+/.test(_end)) {
        wordCount = _end.match(/\d+/)[0]
      }
    }
  }
  if (/－－|--|――|:|：/.test(_pre)) {
    let splitArr = _pre.split(/－－|--|――|:|：/)
    let splitArr0 = splitArr[0]
    title = splitArr[1]
    _.each(locationArr, (n, i) => {
      if (new RegExp(n).test(splitArr0)) {
        location = n
      }
    })
    if (/\d+/.test(splitArr0)) {
      year = splitArr0.match(/\d+/)[0]
    }
  } else {
    title = _pre
    _.each(locationArr, (n, i) => {
      if (new RegExp(n).test(_pre)) {
        location = n
      }
    })
    if (/\d+/.test(_pre)) {
      year = _pre.match(/\d+/)[0]
    }
  }
  return {year, wordCount, titleSim: title, location}
}


/*
* 启动
*   1. 获取目录
*   2. 根据目录url获取文章
* */
let main = async (url) => {
  let pageText = await util.urlResponse(url, {charset: 'gbk'})
  let $ = cheerio.load(pageText)

  let nextHref = $('.artpage a').last().attr('href')

  let pageList = []
  let collectList = []
  $('.artbox_l').each((i, n) => {
    let titleAll = $(n).find('.artbox_l_t a').text()
    let link = $(n).find('.artbox_l_t a').attr('href')
    let contentEll = $(n).find('.artbox_l_c a').text()
    if (/汇总/.test(titleAll)) {
      collectList.push({title: titleAll, link, contentEll})
    } else {
      let titleInfo = parseTitle(titleAll)
      pageList.push({titleAll, link, contentEll, ...titleInfo})
    }
  })

  await util.asyncEach(pageList, async (n) => {
    await util.delay(1000)
    console.log(`n.link`, n.link);
    n.content = await getArticle(n.link)
    if (/作文汇总|范文汇总/.test(n.content)) {

    } else {
      await fss.writeFile('./高考满分作文.json', `${JSON.stringify(n)}\n`, {flag: 'a'})
    }
  })

  console.log(`nextHref`, nextHref);
  if (nextHref) {
    main(nextHref)
  } else {
    console.log(`end`);
  }
};


fss.removeSync('./高考满分作文.json')
main('http://www.zuowen.com/gaokaozw/manfen/index_2.shtml')


