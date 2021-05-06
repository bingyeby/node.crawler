const puppeteer = require('puppeteer')
const _ = require('lodash')
const util = require('../../util')
const fss = require('fs-extra')

/*
* 执行滚动到页面底部一次,页面则会增加新的数据
* 获取到新的数据,返回(list.slice(刷新前的list数目,刷新后的list数据))
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
              answerItemId: answerInfo.itemId, // id 549811428 => https://www.zhihu.com/question/266574241/answer/549811428
              answerItemUrl,// url 可以单独打开

              answerAuthorName,// 回答者昵称
              answerDate: dateCreated,// 回答时间
              answerAuthorUrl,// 回答者头像

              answerUpNumber: upvoteCount,// 点赞数
              answerCommentCount,// 评论数量

              answerHtml,// 回答内容HTML
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

async function getNewScrollList2(page, itemNumber) {
  return await page.evaluate(async (itemNumber) => {
    await util.waitFor(() => $('div.List-item').length > 0)
    let itemList = $('div.List-item')
    let itemListData = []
    itemList.each((i, n) => {
      let item = $(n)
      let answerInfoStr = item.find('.ContentItem.AnswerItem').attr('data-zop') || '{}'
      let answerInfo = JSON.parse(answerInfoStr)// {itemId,authorName}
      itemListData.push({
          questionId: window.location.href.match(/question\/(\d+)/)[1],

          answerId: answerInfo.itemId, // answerId 549811428 => https://www.zhihu.com/question/266574241/answer/549811428

          answerUpCount: item.find('[itemprop="upvoteCount"]').attr('content'),// 点赞数
          answerCommentCount: item.find('[itemprop="commentCount"]').attr('content'),// 评论数量
          answerDate: item.find('[itemprop="dateCreated"]').attr('content'),// 回答时间
          answerUrl: item.find('.ContentItem-time a').attr('href'),// url 可以单独打开
          // answerHtml: item.find('.RichContent-inner').html(),// 回答内容HTML
          answerAuthorName: item.find('.AnswerItem-authorInfo [itemprop="name"]').attr('content'),// 回答者昵称
        },
      )
    })
    console.log(`itemListData`, itemListData)
    window.scroll(0, window.document.body.scrollHeight)
    await util.delay(3000) // 延迟等待页面滚动后数据加载
    itemList.remove()
    $('.Pc-word').remove()
    return itemListData
  }, itemNumber)
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
  await page.setViewport({ width: 1200, height: 800 })// 控制视图大小
  await page.goto('https://www.zhihu.com/question/394252086')// 打开页面

  // 控制表单 对input框填充数据
  // await page.type('#kw', 'puppeteer')

  // 往页面注入js,执行失败,安全策略问题
  // await page.addScriptTag({ path: '\\jquery.js' })
  // await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.4.1.min.js' })
  await util.addScriptFile(page, './js/jquery.js')
  await util.addScriptFile(page, './js/lodash.min.js')
  await util.addScriptFile(page, './js/util.js')

  // 等待一个元素出现后点击该元素
  page.waitForSelector('.Modal-closeButton').then(async () => {
    console.log(`112`, 112)
    page.tap('.Modal-closeButton')// 操作dom元素
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

  // 1. 滚动查询
  // 滚动条滚动到底部3次,获取每次滚动条滚动到底部后新增的数据
  // await util.asyncEach(_.times(3), async (n, i) => {
  //   let newScrollList = await getNewScrollList(page, n)
  //   console.log(`newScrollList`, newScrollList)
  //   await util.writeArrayToJsonFile(`./1.json`, newScrollList, { flag: 'a' })
  // })

  // 1. 滚动查询,并删除已经查询到的
  let jsonFile = `./1.json`
  await fss.remove(jsonFile)
  await util.asyncEach(_.times(10), async (n, i) => {
    let newScrollList = await getNewScrollList2(page, n)
    await util.writeArrayToJsonFile(jsonFile, newScrollList, { flag: 'a' })
  })

  // 2. 分页查询 (按时间排序)
  // https://www.zhihu.com/question/394252086/answers/updated?page=1
  // await page.goto('https://www.zhihu.com/question/394252086/answers/updated?page=1')// 打开页面

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
