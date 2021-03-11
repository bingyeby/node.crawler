if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1]
  console.log('\n'.repeat(height))
}
let path = require('path')
let cheerio = require('cheerio')
let util = require('../../util/index.js')
let _ = require('lodash')
let iconv = require('iconv-lite')
const querystring = require('querystring')
const fss = require('fs-extra')

/*
*
* 获取一页中的段落列表
* query
*   page  页码
*   tstr  类型
*   astr  作者
*   cstr  先秦
*   xstr  形式
* */
let getFullText = async (query) => {
  query.page = query.page || 1
  // https://so.gushiwen.cn/mingjus/default.aspx?page=2&tstr=梅花&astr=&cstr=&xstr=
  let pageText = await util.urlResponse(`https://so.gushiwen.cn/mingjus/default.aspx?${querystring.stringify(query)}`, { charset: 'utf-8' })
  let $ = cheerio.load(pageText)

  let list = []
  $('.left .sons>.cont').each((i, n) => {
    let aList = $(n).find('a')
    let sentences = $(aList[0]).text()
    let source = $(aList[1]).text()
    /*
    * 辛弃疾《满江红·点火樱桃》
    * 《后汉书·列传·刘赵淳于江刘周赵列传》
    * */
    list.push({
      sentences,
      source,
      source_author: _.get(source.match(/.*(?=《)/), 0) || '',
      source_books: _.get(source.match(/(?<=《).*(?=》)/), 0) || '',
    })
  })

  return list
}

/**
 * 获取总页数
 * @param query 查询
 * @returns {Promise<*>}
 */
let getPageTotal = async (query) => {
  let pageText = await util.urlResponse(`https://so.gushiwen.cn/mingjus/default.aspx?${querystring.stringify(query)}`, { charset: 'utf-8' })
  let $ = cheerio.load(pageText)
  let a = $('.pagesright span')[0]
  if (a) {
    let b = $(a).text()
    let c = b.match(/\d+(?=页)/)
    if (c) {
      return c[0]
    }
  }
}

/**
 * 获取总页数
 * 遍历页码,获取每一页的数据
 * @param tstr
 * @param xstr
 * @returns {Promise<void>}
 */
let postListInfo = async ({ tstr, xstr }) => {
  let pageTotal = await getPageTotal({ tstr, xstr }) || 10
  let jsonFile = `./2021-03-04/${tstr || xstr}_名句.json`
  await fss.ensureFile(jsonFile)
  await util.writeArrayToJsonFile(jsonFile, [])
  await util.asyncEach(_.times(pageTotal), async (n, i) => {
    await util.delay()
    let list = await getFullText({ tstr, xstr, page: i + 1 }) // 获取每一页的句子
    await util.writeArrayToJsonFile(jsonFile, list, { flag: 'a' })
  })
}

async function main() {
  // getFullText(1)

  // let tstr = '荀子'
  // postListInfo(tstr)

  // tstr
  util.asyncEach([

    //  2020年12月30日20:25:45
    // '读书',
    '爱情', '励志',

    // '荀子', '孟子', '论语', '墨子', '老子', '史记', '中庸', '礼记', '尚书',
    // '晋书', '左传', '论衡', '管子', '说苑', '列子', '国语',

    // '三国演义', '红楼梦', '水浒传', '西游记',

    '韩非子', '罗织经', '菜根谭',
    // "红楼梦", "弟子规", "战国策", "后汉书", "淮南子", "商君书",

    // "格言联璧", "围炉夜话",
    '增广贤文',
    // "吕氏春秋",
    // "文心雕龙",
    '醒世恒言', '警世通言',
    // "幼学琼林", "小窗幽记", "贞观政要",

  ], async (tstr) => {
    await postListInfo({ tstr })
  })

  // xstr=
  util.asyncEach([
    // '谚语',
  ], async (xstr) => {
    await postListInfo({ xstr })
  })

}

main()
























