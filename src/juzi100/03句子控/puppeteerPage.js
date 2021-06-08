const puppeteer = require('puppeteer')
const _ = require('lodash')
const util = require('../../util')
const url = require('url')
const querystring = require('querystring')
const fss = require('fs-extra')

async function main() {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,      //  关闭无头模式，方便我们看到这个无头浏览器执行的过程
    timeout: 15000,       //  设置超时时间
    devtools: true,    //  是否打开控制台  当此值为true时, headless总为false
    // executablePath: '',    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // ignoreHTTPSErrors: true,    //如果是访问https页面 此属性会忽略https错误

  })

  const page = await browser.newPage()  // 打开空白页面
  await page.setViewport({ width: 1200, height: 800 })// 控制视图大小
  await page.goto('https://www.juzikong.com/tags')// 打开页面

  // 控制表单 对input框填充数据
  // await page.type('#kw', 'puppeteer')

  // 往页面注入js,执行失败,安全策略问题,固采用eval方式注入
  // await page.addScriptTag({ path: '\\jquery.js' })
  // await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.4.1.min.js' })
  await util.addScriptFile(page, '../../js/jquery.js')
  await util.addScriptFile(page, '../../js/lodash.min.js')
  await util.addScriptFile(page, '../../js/util.js')
  await util.addScriptFile(page, '../../js/ajax-hook.js')

  let tagsList = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      util.waitFor('.el-pager>li.number:last-child').then(async (n, i) => {
        console.log(`n`, n)
        let pageAll = n.text().replace(/\s/gi, '')
        let tagsList = []
        await util.asyncEach(_.times(pageAll), async (index) => {
          let tagListInfo = _.map($('.list_1UOCG>li'), (n, i) => {
            return $(n).text().replace(/\s/gi, '')
          })
          tagsList = _.concat(tagsList, tagListInfo)
          console.log(`tagsList`, tagsList)
          $('.btn-next i').click() // 下一页
          await util.delay(10000)
        })
        resolve(tagsList)
      })
    })
  })


}

main()
