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
  await page.goto('https://www.zhihu.com/question/394252086/answers/updated?page=1')// 打开页面

  // 控制表单 对input框填充数据
  // await page.type('#kw', 'puppeteer')

  // 往页面注入js,执行失败,安全策略问题,固采用eval方式注入
  // await page.addScriptTag({ path: '\\jquery.js' })
  // await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.4.1.min.js' })
  await util.addScriptFile(page, './js/jquery.js')
  await util.addScriptFile(page, './js/lodash.min.js')
  await util.addScriptFile(page, './js/util.js')

  // // 登录模态框出现后,将其关闭 ( 添加await则变为并行 )
  // page.waitForSelector('.Modal-closeButton').then(async () => {
  //   console.log(`112`, 112)
  //   page.tap('.Modal-closeButton')// 操作dom元素
  // })
  page.evaluate(() => {
    util.waitFor('.Modal-closeButton').then((btn) => {
      btn.click()
    })

    let total = Number($('[itemprop="answerCount"]').attr('content'))
    let pageAll = Math.ceil(total / 20)

    util.asyncEach(_.times(pageAll), async (index) => {
      await util.waitFor(() => {
        let pageCur = Number($('.PaginationButton--current').text())
        console.log(`pageCur`, pageCur)
        return pageCur === (index + 1)
      })
      await util.waitFor('.PaginationButton-next').then((ele) => {
        ele.click()
      }).catch((e) => {
        console.log(`e`, e)
      })
      await util.delay(10000)
    })

  })

  console.log(`123`, 123)

  // 在浏览器页面中执行如下代码,并将执行后结果返回到node.js
  // 操作dom元素2: 在页面上下文中执行 获取打开的网页中的宿主环境 // 打印语句在浏览器控制台看见
  let questionInfo = await page.evaluate((config) => { // config => 接受普通对象,函数不接受
    console.log(`111`, 111)
    let questionInfoStr = document.querySelector('div[data-zop-question]').getAttribute('data-zop-question')
    return Promise.resolve({
      questionInfo: JSON.parse(questionInfoStr),
      name: document.querySelector('[itemprop="name"]').getAttribute('content'), // 问题标题
      url: document.querySelector('[itemprop="url"]').getAttribute('content'),// 问题URL
      answerCount: Number(document.querySelector('[itemprop="answerCount"]').getAttribute('content')),// 回答数量
    })
  }, {})

  console.log(`pageInfo`, questionInfo)

  let pageListItemDomSize = await page.evaluate((arr) => {
    let res = document.querySelectorAll('div.List-item').length || 0
    return Promise.resolve(res)
  })

  console.log(`pageListItemDomSize`, pageListItemDomSize)

  page.waitForSelector('.PaginationButton-next').then(async () => {
    console.log(`333333`, 333333)
    page.tap('.PaginationButton-next')// 操作dom元素
    await util.delay(3000)
    let queryPage = querystring.parse(url.parse(page.url()).query).page
    console.log(`queryPage`, queryPage)
  })

  // 2. 分页查询 (按时间排序)

  // 直接在node中获取html信息
  // setTimeout(async (n, i) => {
  //   let linkHtml = await page.$eval('.List-item', (ele) => ele.innerHTML)// 获取文本
  //   console.log(`linkHtml`, linkHtml)
  // }, 3000 * 10)

  // 等待页面存在此元素
  // page.waitForSelector('#content_left .result').then(async () => {
  //   const resultEle = await page.$('#content_left .result:nth-child(2) h3 a')
  //   resultEle.click()// 打开一个页面1
  //
  //   let linkHtml = await page.$eval('#content_left .result:nth-child(2) h3 a', (ele) => ele.innerHTML)// 获取文本
  //   console.log(` linkHtml`, linkHtml)
  //
  //   // await page.tap('#content_left .result:nth-child(1) h3 a');// 打开一个页面2
  // })

  // await page.screenshot({path: './test.png'})// 截屏保存

  // const content = await page.content();// 获取页面内容
  // console.log(`main content`, content);
  // await browser.close();// 关闭浏览器
}

main()
