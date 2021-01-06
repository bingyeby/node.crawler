const puppeteer = require('puppeteer')
const _ = require('lodash')
const util = require('../../util')

/*
* 滚动下降一次,页面新请求到的数据
*
* */
async function getNewScrollList(page, pageListItemDomSize) {
  let listItemScrollAddList = await page.evaluate((pageListItemDomSize) => {
    let listItemSizeHis = pageListItemDomSize === 0 ? 0 : document.querySelectorAll('div.List-item').length
    window.scroll(0, window.document.body.scrollHeight)
    return new Promise((resolve, reject) => {
      let timeNum = 0
      let res = []
      let timeId = setInterval(async (n, i) => {
        let listItemSizeCur = document.querySelectorAll('div.List-item').length
        let last = document.querySelectorAll('div.List-item')[document.querySelectorAll('div.List-item').length - 1]
        if ((listItemSizeCur > listItemSizeHis) && last.querySelector('[itemprop="upvoteCount"]')) {
          res = [...document.querySelectorAll('div.List-item')].slice(listItemSizeHis - listItemSizeCur).map((item, i) => {
            let upvoteCount = item.querySelector('[itemprop="upvoteCount"]').getAttribute('content')
            let dateCreated = item.querySelector('[itemprop="dateCreated"]').getAttribute('content')
            let answerCommentCount = item.querySelector('[itemprop="commentCount"]').getAttribute('content')

            let answerInfoStr = item.querySelector('.ContentItem.AnswerItem').getAttribute('data-zop') || '{}'
            let answerInfo = JSON.parse(answerInfoStr)// {itemId,authorName}

            let answerAuthorUrl = item.querySelector('.AnswerItem-authorInfo [itemprop="url"]').getAttribute('content')
            let answerAuthorName = item.querySelector('.AnswerItem-authorInfo [itemprop="name"]').getAttribute('content')

            let answerItemUrl = item.querySelector('.ContentItem-time a').getAttribute('href')

            let answerHtml = item.querySelector('.RichContent-inner').innerHTML

            console.log(`answerHtml`, answerHtml)

            return {
              upvoteCount,// 点赞数
              dateCreated,// 创建时间
              answerCommentCount,// 评论数量
              answerItemId: answerInfo.itemId, // https://www.zhihu.com/question/266574241/answer/549811428
              answerItemUrl,
              answerAuthorUrl,
              answerAuthorName,
              answerHtml,
            }
          })
          clearInterval(timeId)
          resolve(res)
        }
        if (timeNum > 5) {
          clearInterval(timeId)
          resolve(res)
        }
        timeNum++
      }, 3000)
    })
  }, pageListItemDomSize)
  return listItemScrollAddList
}

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
  await page.setViewport({ width: 1000, height: 800 })// 控制视图大小
  await page.goto('https://www.zhihu.com/question/266574241')// 打开页面

  // 控制表单 对input框填充数据
  // await page.type('#kw', 'puppeteer')

  // 往页面注入js,执行失败,安全策略问题
  // await page.addScriptTag({ path: '\\jquery.js' })
  // await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.4.1.min.js' })

  // 等待一个元素出现后点击该元素
  page.waitForSelector('.Modal-closeButton').then(async () => {

    console.log(`112`, 112)
    page.tap('.Modal-closeButton')// 操作dom元素
  })

  console.log(`123`, 123)

  // 在浏览器页面中执行如下代码,并将执行后结果返回到node.js
  // 操作dom元素2: 在页面上下文中执行 获取打开的网页中的宿主环境 // 打印语句在浏览器控制台看见
  let pageInfo = await page.evaluate((config) => {

    console.log(`111`, 111)

    let questionInfoStr = document.querySelector('div[data-zop-question]').getAttribute('data-zop-question')
    let questionTitle = Number(document.querySelector('[itemprop="name"]').getAttribute('content'))
    let questionUrl = Number(document.querySelector('[itemprop="url"]').getAttribute('content'))
    let answerCount = Number(document.querySelector('[itemprop="answerCount"]').getAttribute('content'))

    console.log(`document.querySelector('[itemprop="name"]')`, document.querySelector('[itemprop="name"]'))

    return Promise.resolve({
      questionInfo: JSON.parse(questionInfoStr),
      questionTitle, // 问题标题
      questionUrl,// 问题URL
      answerCount,// 回答数量
    })
  }, {})

  console.log(`pageInfo`, pageInfo)

  let pageListItemDomSize = await page.evaluate((arr) => {
    let res = document.querySelectorAll('div.List-item').length || 0
    return Promise.resolve(res)
  })
  console.log(`pageListItemDomSize`, pageListItemDomSize)

  await util.asyncEach(_.times(3), async (n, i) => {
    let newScrollList = await getNewScrollList(page, n)
    console.log(`newScrollList`, newScrollList)
  })

  console.log(`end...`)

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
