const puppeteer = require('puppeteer')
const _ = require('lodash')
const util = require('../util')
const fss = require('fs-extra')
const dayjs = require('dayjs')
const downImgUtil = require('./downImgUtil')

async function downOnePageImg(page, info){
  await page.goto(info.href, { timeout: 0 })// 打开页面

  await util.addScriptFile(page, '../js/jquery.js')
  await util.addScriptFile(page, '../js/lodash.min.js')
  await util.addScriptFile(page, '../js/util.js')

  let imageListAll = await page.evaluate((config) => { // config => 接受普通对象|字符串,不接受函数
    let resList = []

    $('.content_left img').each((i, n) => {
      resList.push($(n).attr('src'))// window.location.origin +
    })
    console.log(`resList`, resList)
    return Promise.resolve(resList)
  }, {})

  console.log(`imageListAll`, imageListAll)
  await downImgUtil.downImageList(imageListAll, 'down', info.title.slice(0, 10).replace(/\?/gi, '')) // info.title
}

async function main(url){
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,      //  关闭无头模式，方便我们看到这个无头浏览器执行的过程
    timeout: 15000,       //  设置超时时间
    devtools: false,    //  是否打开控制台  当此值为true时, headless总为false
    // executablePath: '',    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // ignoreHTTPSErrors: true,    //如果是访问https页面 此属性会忽略https错误
  })

  const page = await browser.newPage()  // 打开空白页面
  await page.setViewport({ width: 1200, height: 800 })// 控制视图大小

  await util.asyncEach([5, 6, 7, 8, 9, 10], async (n, i) => {

    await page.goto(``, { timeout: 0 })// 打开页面

    await util.addScriptFile(page, '../js/jquery.js')
    await util.addScriptFile(page, '../js/lodash.min.js')
    await util.addScriptFile(page, '../js/util.js')

    let urlList = await page.evaluate((config) => { // config => 接受普通对象|字符串,不接受函数
      let resList = []

      $('ul.ul_author_list>li>a').each((i, n) => {
        resList.push({
          href: window.location.origin + $(n).attr('href'),
          title: $(n).text(),
        })
      })

      console.log(`resList`, resList)
      return Promise.resolve(resList)
    }, {})

    console.log(`urlList`, urlList)

    await util.asyncEach(urlList, async (n, i) => {
      await downOnePageImg(page, n)
    })
  })

  await browser.close()// 关闭浏览器
}

// 308072414
// 309298287
main()
